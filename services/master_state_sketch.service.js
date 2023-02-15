const {logger} = require('../logger/firebase.logger');

const { v4: uuidv4 } = require('uuid');

const MasterStateSketchRepository = require('../repositories/master_state_sketch.repository');
const {MasterStateSketchUnavailableModel,MasterStateSketchServingModel,MasterStateSketchAppointmentModel} = require('../models/master_state_sketch.model');
const { ServiceStateEnum } = require('../models/service_state.enum');

const listAll = async function(uid) {
    let masterStateSketchList = await MasterStateSketchRepository.listAll(uid);
    let reuslt = [];
    logger.info(`listAll: total ${reuslt.length} master state sketch found`);
    return masterStateSketchList;
}
const length = async function(uid) {
    logger.info(`length: total ${masterStateSketchList.length} master state sketch found`);
    return await MasterStateSketchRepository.length(uid);
}

const add = async function(uid, newMasterStateSketch){
    return await MasterStateSketchRepository.add(uid, newMasterStateSketch);
}
const addAppointment = async function(serviceModel){
    logger.info(`[service] addAppointment: service ${serviceModel.guid} accpeted by masterUid ${serviceModel.assignedMasterUid}`);
    logger.debug(`[service] addAppointment: serviceModel=${JSON.stringify(serviceModel)}`);
    let endAt = new Date(serviceModel.appointmentStartAt.getTime() + serviceModel.totalServiceMinutes * 60000)
    // create AppointmentStateSketchModel from acceptedAssign
    let newAppointmentStateSketch = new MasterStateSketchAppointmentModel(
        uuidv4(),
        serviceModel.hostUid,
        serviceModel.orderGuid,
        serviceModel.guid,

        serviceModel.appointmentStartAt,
        null,
        endAt, // endAt

        serviceModel.totalServiceMinutes,

        null,
        null,

        new Date(),
        null,
    );
    logger.debug(`[service] addAppointment: newAppointmentStateSketch=${newAppointmentStateSketch.endAt}`);

    return await add(serviceModel.assignedMasterUid,newAppointmentStateSketch)

}
const updateAppointmentStartAt = async function(serviceModel, previousStartAt, newStartAt){

    logger.info(`[service] updateAppointmentStartAt: service ${serviceModel.guid} startAt is updated from ${previousStartAt} to ${newStartAt}`);
    // get previous appointment sketch by service's assignMasterUid and service's guid
    let appointmentStateSketch = await MasterStateSketchRepository.getAppointmentStateSketchByMasterUidAndServiceGuid(serviceModel.assignedMasterUid,serviceModel.guid);
    logger.debug(`[service] updateAppointmentStartAt: appointmentStateSketch=${JSON.stringify(appointmentStateSketch)}`);
    if (appointmentStateSketch == null) {
        logger.warn(`[service] updateAppointmentStartAt: service ${serviceModel.guid} is not found`);
        return null;
    }
    logger.debug(`[service] updateAppointmentStartAt: appointmentStateSketch=${JSON.stringify(appointmentStateSketch.toJson())}`);

    // update appointment sketch 
    appointmentStateSketch.previousStartAt = previousStartAt;
    appointmentStateSketch.startAt = newStartAt;
    appointmentStateSketch.lastModifiedAt = new Date();
    appointmentStateSketch.endAt = new Date(newStartAt.getTime() + appointmentStateSketch.serviceDurationMinutes * 60000);

    logger.debug(`[service] updateAppointmentStartAt: appointmentStateSketch=${JSON.stringify(appointmentStateSketch.toJson())}`);
    let result = await MasterStateSketchRepository.updateAppointmentStateSketch(serviceModel.assignedMasterUid,appointmentStateSketch);
    logger.info(`[service] updateAppointmentStartAt finished.`);

    return result

}
const updateAppointmentServiceDuration = async function(serviceModel,oldDuration, newDuration){
    // check duration is increased or decreased
    let updateDurationMinutes = newDuration - oldDuration;
    logger.info(`[service] updateAppointmentServiceDuration: service ${serviceModel.guid} duration is updated from ${oldDuration} to ${newDuration}, updateDurationMinutes=${updateDurationMinutes}`);
    // get previous appointment sketch by service's assignMasterUid and service's guid
    let appointmentStateSketch = await MasterStateSketchRepository.getAppointmentStateSketchByMasterUidAndServiceGuid(serviceModel.assignedMasterUid,serviceModel.guid);
    logger.debug(`[service] updateAppointmentServiceDuration: appointmentStateSketch=${JSON.stringify(appointmentStateSketch)}`);
    if (appointmentStateSketch == null) {
        logger.warn(`[service] updateAppointmentServiceDuration: service ${serviceModel.guid} is not found`);
        return null;
    }
    logger.debug(`[service] updateAppointmentServiceDuration: appointmentStateSketch=${JSON.stringify(appointmentStateSketch.toJson())}`);
    // update appointment sketch 
    appointmentStateSketch.serviceDurationMinutes = newDuration;
    if (appointmentStateSketch.addSubMinutes != null && appointmentStateSketch.addSubMinutes.length > 0) {
        appointmentStateSketch.addSubMinutes.push(updateDurationMinutes);
    }else{
        appointmentStateSketch.addSubMinutes = [updateDurationMinutes];
    }
    appointmentStateSketch.lastModifiedAt = new Date();
    appointmentStateSketch.endAt = new Date(appointmentStateSketch.startAt.getTime() + appointmentStateSketch.serviceDurationMinutes * 60000);
    logger.debug(`[service] updateAppointmentServiceDuration: appointmentStateSketch=${JSON.stringify(appointmentStateSketch.toJson())}`);
    let result = await MasterStateSketchRepository.updateAppointmentStateSketch(serviceModel.assignedMasterUid,appointmentStateSketch);
    logger.info(`[service] updateAppointmentServiceDuration finished.`);

    return result

}
const cancelAppointmentService = async (serviceModel)=>{
    logger.info(`[service] cancelAppointmentService: service ${serviceModel.guid} is cancelled by masterUid ${serviceModel.assignedMasterUid}`);
    // get previous appointment sketch by service's assignMasterUid and service's guid
    let appointmentStateSketch = await MasterStateSketchRepository.getAppointmentStateSketchByMasterUidAndServiceGuid(serviceModel.assignedMasterUid,serviceModel.guid);
    if (appointmentStateSketch == null) {
        logger.warn(`[service] cancelAppointmentService: service ${serviceModel.guid} is not found`);
        return null;
    }
    logger.debug(`[service] cancelAppointmentService: appointmentStateSketch=${JSON.stringify(appointmentStateSketch)}`);
    // update appointment sketch
    appointmentStateSketch.canceledAt = serviceModel.lastModifiedAt;
    appointmentStateSketch.lastModifiedAt = new Date();
    logger.debug(`[service] cancelAppointmentService: appointmentStateSketch=${JSON.stringify(appointmentStateSketch.toJson())}`);
    let result = await MasterStateSketchRepository.updateAppointmentStateSketch(serviceModel.assignedMasterUid,appointmentStateSketch);
    logger.info(`[service] cancelAppointmentService finished.`);
    return result

}

const setupServing = async (serviceModel)=>{
    logger.info(`[service] setupServing: service ${serviceModel.guid} is setup serving by masterUid ${serviceModel.assignedMasterUid}`);
    // check current service sketch
    // guid,
    // storeUid,
    // orderUid,
    // serviceUid,
    // startedAt,
    // previousStartAt,
    // endAt,
    // serviceDurationMinutes,
    // lastModifiedAt,
    // canceledAt,
    // createdAt,
    // addSubMinutes,
    // resetAt,
    // completedSeconds
    let serving = new MasterStateSketchServingModel(
        uuidv4(),
        serviceModel.hostUid,
        serviceModel.orderGuid,
        serviceModel.guid,
        serviceModel.startedAt,
        null,
        serviceModel.assertCompletedAt,
        serviceModel.totalServiceMinutes,
        null,
        null,
        serviceModel.startedAt,
        null,
        null,
        serviceModel.completedSeconds
    )
    await MasterStateSketchRepository.setupServing(serviceModel.assignedMasterUid,serving);
    return serving;

}
const updateServingServiceDuration = async (serviceModel,totalAddedMinutes)=>{
    logger.info(`[service] updateServingServiceDuration: service ${serviceModel.guid} is update serving by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] updateServingServiceDuration: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    logger.debug(`[service] updateServingServiceDuration: totalAddedMinutes=${totalAddedMinutes}`);

    // update serving sketch
    serving.serviceDurationMinutes = serviceModel.totalServiceMinutes;
    // when addSubMinutes is null, assign a new array
    if (serving.addSubMinutes == null) {
        serving.addSubMinutes = []
    }
    serving.addSubMinutes.push(totalAddedMinutes);
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    // when endAt is null, it means service is pasued or not started
    if (serving.endAt != null) {
        logger.debug(`[service] updateServingServiceDuration: replace endAt with new ${serviceModel.assertCompletedAt}`);
        serving.endAt = serviceModel.assertCompletedAt;
    }else{
        logger.debug(`[service] updateServingServiceDuration: service ${serviceModel.guid} is paused or not started`);
    }
    logger.debug(`[service] updateServingServiceDuration: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;


}
const pauseServing = async (serviceModel)=>{
    logger.debug(`[service] pauseServing: service ${serviceModel.guid} pause by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] pauseServing: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] pauseServing: oldServing already newer than newServing`);
            return null;
        }
    }
    if (serving.endAt == null) {
        logger.warn(`[service] pauseServing: service ${serviceModel.guid} is already paused`);
        return null;
    }
    // update serving sketch
    serving.endAt = null;
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    logger.debug(`[service] pauseServing: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;

}

const resumeServing = async (serviceModel)=>{
    logger.debug(`[service] resumeServing: service ${serviceModel.guid} resume by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] resumeServing: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] resumeServing: oldServing already newer than newServing`);
            return null;
        }
    }
    if (serving.endAt != null) {
        logger.warn(`[service] resumeServing: service ${serviceModel.guid} is already in serving.`);
        return null;
    }
    // update serving sketch
    serving.endAt = serviceModel.assertCompletedAt;
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    logger.debug(`[service] resumeServing: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
}
const extraCompletedServingServiceDuration = async (serviceModel,increasedMinutes)=>{
    logger.debug(`[service] extraCompletedServingServiceDuration: service ${serviceModel.guid} extra completed by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] extraCompletedServingServiceDuration: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] extraCompletedServingServiceDuration: oldServing already newer than newServing`);
            return null;
        }
    }
    // update serving sketch
    serving.serviceDurationMinutes = serviceModel.totalServiceMinutes;
    // when addSubMinutes is null, assign a new array
    if (serving.addSubMinutes == null) {
        serving.addSubMinutes = []
    }
    serving.addSubMinutes.push(increasedMinutes);
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    // serving.previousStartAt = serviceModel.lastModifiedAt;
    // when endAt is null, it means service is pasued or not started
    if (serving.endAt != null) {
        logger.debug(`[service] extraCompletedServingServiceDuration: replace endAt with new ${serviceModel.assertCompletedAt}`);
        serving.endAt = serviceModel.assertCompletedAt;
    }else{
        logger.debug(`[service] extraCompletedServingServiceDuration: service ${serviceModel.guid} is paused or not started`);
    }
    logger.debug(`[service] extraCompletedServingServiceDuration: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;
}

const finishServing = async (serviceModel)=>{
    logger.debug(`[service] finishServing: service ${serviceModel.guid} finish by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] finishServing: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] finishServing: oldServing already newer than newServing`);
            return null;
        }
    }

    serving.endAt = serviceModel.doneAt;
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    logger.debug(`[service] finishServing: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
}

const resetServing = async (serviceModel,resetAt)=>{
    logger.info(`[service] resetServing: service ${serviceModel.guid} reset by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] resetServing: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] resetServing: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] resetServing: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] resetServing: oldServing(${serving.lastModifiedAt}) already newer than newServing(${serving.lastModifiedAt}) ${serving.lastModifiedAt.getTime()}-${serviceModel.lastModifiedAt.getTime()}`);
            return null;
        }
    }
    // update serving sketch
    serving.previousStartAt = serving.startAt;
    serving.startAt = resetAt;
    serving.resetAt = resetAt;
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    if (serving.endAt != null) {
        serving.endAt = serviceModel.assertCompletedAt;
    }
    serving.completedSeconds = serviceModel.completedSeconds;
    logger.debug(`[service] resetServing: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;

}

// when jumpSeconds is negative, it means jump back
const jumpServing = async (serviceModel,jumpSeconds)=>{
    logger.info(`[service] jumpServing: service ${serviceModel.guid} jump serving times ${jumpSeconds} seconds by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] jumpServing: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] jumpServing: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] jumpServing: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] jumpServing: oldServing already newer than newServing`);
            return null;
        }
    }
    logger.debug(`[service] jumpServing: serving=${JSON.stringify(serving.toJson())}`);
    // update serving sketch
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    if (serving.endAt != null){
        serving.endAt = serviceModel.assertCompletedAt;
    }
    logger.debug(`[service] jumpServing: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;
}

const cancelServing= async (serviceModel,canceledAt)=>{
    // get current serving sketch from repository
    // when it's not exists logging warning and return null
    // when it's exists
    //     check serving is not canceled
    //     check this modify should newer than older
    //     update serving sketch
    //     return serving sketch
    logger.debug(`[service] cancelServingService: service ${serviceModel.guid} cancel by masterUid ${serviceModel.assignedMasterUid}`);
    // get current serving sketch
    let serving = await MasterStateSketchRepository.getServing(serviceModel.assignedMasterUid,serviceModel.guid);
    if (serving == null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is not found`);
        return null;
    }
    if (serving.canceledAt != null) {
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already canceled`);
        return null;
    }
    if (serving.deletedAt != null){
        logger.warn(`[service] cancelServingService: service ${serviceModel.guid} is already deleted`);
        return null;
    }
    // check this modify should newer than older
    if (serving.lastModifiedAt != null){
        if (serving.lastModifiedAt.getTime() > serviceModel.lastModifiedAt.getTime()) {
            logger.warn(`[service] cancelServingService: oldServing already newer than newServing`);
            return null;
        }
    }
    // update serving sketch
    serving.canceledAt = canceledAt;
    serving.lastModifiedAt = serviceModel.lastModifiedAt;
    serving.completedSeconds = serviceModel.completedSeconds;
    logger.debug(`[service] cancelServingService: serving=${JSON.stringify(serving.toJson())}`);
    await MasterStateSketchRepository.updateServing(serviceModel.assignedMasterUid,serving);
    return serving;
}


/// warning: service state update to "Paused" will not update assertCompletedAt
///         update service state to "Paused" will not trigger when service state is not "Serving"
/// update service state to "Serving" should provide assertCompletedAt
/// all date string should convert to Date object before pass to this function

const updateServiceStateSketch = async (uid, guid, updatedFields)=>{
    logger.info(`[service] updateServiceStateSketch: uid=${uid}, guid=${guid}`);
    logger.debug(`[service] updateServiceStateSketch: uid=${uid}, guid=${guid}, updatedFields=${JSON.stringify(updatedFields)}`);
    // get current disable state sketch from db
    let serviceStateSketch = await MasterStateSketchRepository.get(uid,guid);
    // check model is found from repository
    if(serviceStateSketch == null){
        logger.info(`[service] updateServiceStateSketch: $uid=${uid}, guid=${guid} is not found`);
        return false;
    }
    // check model from repository is MasterStateSketchServingModel 
    if(!(serviceStateSketch instanceof MasterStateSketchServingModel)){
        logger.info(`[service] updateServiceStateSketch: serviceStateSketch=${guid} is not MasterStateSketchServingModel`);
        return false;
    }
    logger.debug(`[service] updateServiceStateSketch: ${JSON.stringify(serviceStateSketch.toJson())}`);
    let isUpdated = false;
    // when updatedFields contains "appointmentStartAt"
    // add "previousAppointmentStartAt" to the updatedFields
    if (updatedFields.appointmentStartAt != null
        && updatedFields.appointmentStartAt.getTime() != serviceStateSketch.appointmentStartAt.getTime()) {
        isUpdated = true;
        updatedFields.previousAppointmentStartAt = serviceStateSketch.appointmentStartAt;
        logger.debug(`[service] updateServiceStateSketch: add previsouAppointmentStartAt=${updatedFields.previousAppointmentStartAt.toISOString()}`);
    }
    // when updatedFields contains "totalServiceMinutes"
    // add "previousTotalServiceMinutes" to the updatedFields
    if (updatedFields.totalServiceMinutes != null 
        && updatedFields.totalServiceMinutes != serviceStateSketch.totalServiceMinutes) {
        isUpdated = true;
        updatedFields.previousTotalServiceMinutes = serviceStateSketch.totalServiceMinutes;
        logger.debug(`[service] updateServiceStateSketch: add previousTotalServiceMinutes=${updatedFields.previousTotalServiceMinutes}`);
    }
    if (updatedFields.state != null && updatedFields.state != serviceStateSketch.state) {
        if (updatedFields.state == ServiceStateEnum.Paused.toString() && serviceStateSketch.state != ServiceStateEnum.Serving) {
            logger.warn(`[service] updateServiceStateSketch: can not update state from=${serviceStateSketch.state} to=${updatedFields.state}`);
        }else{
            isUpdated = true;
            logger.debug(`[service] updateServiceStateSketch: update state from=${serviceStateSketch.state} to=${updatedFields.state}`);
        }

    }
    if (updatedFields.startAt != null) {
        if (serviceStateSketch.startAt != null) {
            if ( updatedFields.startAt.getTime() != serviceStateSketch.startAt.getTime()){
            isUpdated = true;
            logger.debug(`[service] updateServiceStateSketch: update startAt from=${serviceStateSketch.startAt.toISOString()} to=${updatedFields.startAt.toISOString()}`);
            }
        }else{
            isUpdated = true;
            logger.debug(`[service] updateServiceStateSketch: update startAt=${updatedFields.startAt.toISOString()}`);
        }
    }
    if (updatedFields.assertCompletedAt != null) {
        if (serviceStateSketch.assertCompletedAt != null) {
            if ( updatedFields.assertCompletedAt.getTime() == serviceStateSketch.assertCompletedAt.getTime()){
            isUpdated = true;
            logger.debug(`[service] updateServiceStateSketch: update assertCompletedAt from=${serviceStateSketch.assertCompletedAt.toISOString()} to=${updatedFields.assertCompletedAt.toISOString()}`);
            }
        }else{
            isUpdated = true;
            logger.debug(`[service] updateServiceStateSketch: update assertCompletedAt=${updatedFields.assertCompletedAt.toISOString()}`);
        }
    }

    if(isUpdated){
        var updatedStateSketch = Object.assign(serviceStateSketch, updatedFields);
        updatedStateSketch.lastModifiedAt = new Date();
        logger.info(`[service] updateServiceStateSketch do.`);
        logger.debug(`[service] ${JSON.stringify(updatedStateSketch.toJson())}`);
        await MasterStateSketchRepository.update(uid,updatedStateSketch);
        return updatedStateSketch
    }else{
        logger.info(`[service] updateServiceStateSketch: no update`);
        return null;
    }



}

/**
 * 
 * @param {*} uid   master uid
 * @param {*} guid updated state sketch guid 
 * @param {*} updatedEndAt  should be Date object
 */
const updateDisableStateSketchEndAt = async function(uid,guid, updatedEndAt){

    logger.info(`[service] updateDisableStateSketchEndAt: uid=${uid}, guid=${guid}, updatedEndAt=${updatedEndAt}`);
    // get current disable state sketch from db
    let disableStateSketch = await MasterStateSketchRepository.get(uid,guid);
    if (disableStateSketch == null) {
        logger.info(`[service] updateDisableStateSketchEndAt: id=${uid}, guid=${guid} is not found`);
        return false;
    }
    logger.debug(`[service] updateDisableStateSketchEndAt: ${JSON.stringify(disableStateSketch.toJson())}`);
    // check model from repository is MasterStateSketchUnavailableModel
    if(!(disableStateSketch instanceof MasterStateSketchUnavailableModel)){
        logger.warn(`[service] updateDisableStateSketchEndAt: id=${uid}, guid=${guid} is not MasterStateSketchUnavailableModel`);
        return false;
    }

    // check updatedEndAt is later than current disable state sketch endAt
    if(updatedEndAt.getTime() > disableStateSketch.endAt.getTime()){
        // update previsou end at
        let updatedFields = {
            endAt: updatedEndAt,
            previousEndAt: disableStateSketch.endAt,
            lastModifiedAt: new Date(),
        }
        logger.debug(`[service] updateDisableStateSketchEndAt: updatedFields=${JSON.stringify(updatedFields)}`);
        let updateStateSketch = Object.assign(disableStateSketch, updatedFields);
        let result = await MasterStateSketchRepository.update(uid,updateStateSketch);
        logger.info(`[service] updateDisableStateSketchEndAt finished.`);
        return result;
    }else{
        logger.info(`[service] updateDisableStateSketchEndAt: updatedEndAt is earlier than current disable state sketch endAt, no need to update`);
        logger.debug(`[service] updateDisableStateSketchEndAt: updatedEndAt=${updatedEndAt.toISOString()}, current disable state sketch endAt=${disableStateSketch.endAt.toISOString()}`);
        return
    }

}
/**
 * @deprecated
 * @param {*} uid 
 * @param {*} guid 
 * @returns 
 */
const updateDisableStateSketchToCanceled = async function(uid,guid){
    let disableStateSketch = await MasterStateSketchRepository.get(uid,guid);
    if (disableStateSketch == null) {
        logger.info(`[service] updateDisableStateSketchToCanceled: ${guid} is not found`);
        return false;
    }
    logger.debug(`[service] updateDisableStateSketchEndAt: ${JSON.stringify(disableStateSketch.toJson())}`);
    // check model from repository is MasterStateSketchUnavailableModel
    if(!(disableStateSketch instanceof MasterStateSketchUnavailableModel)){
        logger.warn(`[service] updateDisableStateSketchEndAt: model is not MasterStateSketchUnavailableModel`);
        return false;
    }
    // check current disable state sketch is not canceled
    if(disableStateSketch.canceledAt != null){
        logger.info(`[service] updateDisableStateSketchEndAt: current disable state sketch is already canceled`);
        return false;
    }

    let now = new Date();
    disableStateSketch.lastModifiedAt = now;
    disableStateSketch.canceledAt = now;
    logger.debug(`[service] updateStateSketch ${JSON.stringify(disableStateSketch.toJson())}`);
    let result = await MasterStateSketchRepository.update(uid,disableStateSketch);
    logger.info(`[service] updateDisableStateSketchToCanceled finished.`);
    return result;
}
const remove = async function(uid,guid,){
    return await MasterStateSketchRepository.remove(uid,guid);
}

const addUnavailableStateSketch = async function(unavailable){
    logger.info(`[service] addUnavailableStateSketch=${unavailable.guid} uid=${unavailable.uid}`);
    logger.debug(`[service] addUnavailableStateSketch=${JSON.stringify(unavailable)}`);
    logger.debug(`[service] addUnavailableStateSketch=${JSON.stringify(unavailable.toJson())}`);

    // generate unavaiable state sketch from unavailable model
    // guid,startAt,previousStartAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,
    let sketch = new MasterStateSketchUnavailableModel(unavailable.guid,unavailable.startAt,null,unavailable.endAt,unavailable.createdAt,null,null,null);
    logger.debug(`[service] addUnavailableStateSketch=${JSON.stringify(sketch.toJson())}`);
    let result = await MasterStateSketchRepository.addUnavailableStateSketch(unavailable.uid,sketch);
    // logger.debug(`[service] addUnavailableStateSketch=${result}`);
    logger.info(`[service] addUnavailableStateSketch finished.`);
}
const cacnelUnavailable = async function(uid,guid,canceledAt){

    logger.info(`[service] cacnelUnavailableStateSketch=${guid} uid=${uid}`);
    // get unavailable from firestore
    let oldStateSketch = await MasterStateSketchRepository.getUnavailableStateSketch(uid,guid)
    if (oldStateSketch == null) {
        logger.warn(`[service] cacnelUnavailableStateSketch: ${guid} is not found`);
        throw new Error(`[service] cacnelUnavailableStateSketch: ${guid} is not found`);
    }
    logger.debug(`[service] cacnelUnavailableStateSketch: ${JSON.stringify(oldStateSketch.toJson())}`);
    // check stateSketch is  or canceled
    if (oldStateSketch.canceledAt != null) {
        logger.info(`[service] cacnelUnavailableStateSketch: ${guid} is already canceled`);
        return;
    }
    oldStateSketch.canceledAt = canceledAt;
    oldStateSketch.lastModifiedAt = canceledAt;
    logger.debug(`[service] cacnelUnavailableStateSketch: ${JSON.stringify(oldStateSketch.toJson())}`);
    // cancel this stateSketch
    let result = await MasterStateSketchRepository.updateUnavailableStateSketch(uid,oldStateSketch);
    if (result == null) {
        logger.info(`[service] cacnelUnavailableStateSketch: ${guid} cannot be canceled`);
        return null;
    }
    logger.info(`[service] cacnelUnavailableStateSketch finished.`);
    return result;
}

const updateUnavailableStartAt = async function(uid,guid,updatedStartAt,updateAt){
    logger.info(`[service] cacnelUnavailableStateSketch=${guid} uid=${uid}`);
    // get unavailable from firestore
    let oldStateSketch = await MasterStateSketchRepository.getUnavailableStateSketch(uid,guid)
    if (oldStateSketch == null) {
        logger.warn(`[service] updateUnavailableStartAt: ${guid} is not found`);
        throw new Error(`[service] updateUnavailableStartAt: ${guid} is not found`);
    }
    logger.debug(`[service] updateUnavailableStartAt: ${JSON.stringify(oldStateSketch.toJson())}`);
    // check stateSketch is  or canceled
    if (oldStateSketch.canceledAt != null) {
        logger.info(`[service] updateUnavailableStartAt: ${guid} is already canceled`);
        return;
    }
    oldStateSketch.previousStartAt = oldStateSketch.startAt
    oldStateSketch.startAt = updatedStartAt;
    oldStateSketch.lastModifiedAt = updateAt;
    logger.debug(`[service] updateUnavailableStartAt: ${JSON.stringify(oldStateSketch.toJson())}`);
    // cancel this stateSketch
    let result = await MasterStateSketchRepository.updateUnavailableStateSketch(uid,oldStateSketch);
    if (result == null) {
        logger.info(`[service] updateUnavailableStartAt: ${guid} cannot be canceled`);
        return null;
    }
    logger.info(`[service] updateUnavailableStartAt finished.`);
    return result;

}

const updateUnavailableEndAt = async function(uid,guid,endAt,updateAt){
    logger.info(`[service] updateUnavailableEndAt=${guid} uid=${uid}`);
    // get unavailable from firestore
    let oldStateSketch = await MasterStateSketchRepository.getUnavailableStateSketch(uid,guid)
    if (oldStateSketch == null) {
        logger.warn(`[service] updateUnavailableEndAt: ${guid} is not found`);
        throw new Error(`[service] updateUnavailableEndAt: ${guid} is not found`);
    }
    logger.debug(`[service] updateUnavailableEndAt: ${JSON.stringify(oldStateSketch.toJson())}`);
    // check stateSketch is  or canceled
    if (oldStateSketch.canceledAt != null) {
        logger.info(`[service] updateUnavailableEndAt: ${guid} is already canceled`);
        return;
    }
    let previousEndAt = oldStateSketch.endAt;
    let previousAddSubMinutes = oldStateSketch.addSubMinutes
    if (previousAddSubMinutes == null){
        previousAddSubMinutes = []
    }
    let changedMinutes = Math.floor((endAt.getTime() - previousEndAt.getTime()) / 60000)

    // calculate addSubMinutes
    logger.debug(`[service] updateUnavailableEndAt: update endAt from ${previousEndAt} to ${endAt} changed ${changedMinutes}`,{structuredData:true})
    previousAddSubMinutes.push(changedMinutes)
    oldStateSketch.endAt = endAt;
    oldStateSketch.addSubMinutes = previousAddSubMinutes
    oldStateSketch.lastModifiedAt = updateAt;
    logger.debug(`[service] updateUnavailableEndAt: ${JSON.stringify(oldStateSketch.toJson())}`);
    // cancel this stateSketch
    let result = await MasterStateSketchRepository.updateUnavailableStateSketch(uid,oldStateSketch);
    if (result == null) {
        logger.info(`[service] updateUnavailableEndAt: ${guid} cannot be canceled`);
        return null;
    }
    logger.info(`[service] updateUnavailableEndAt finished.`);
    return result;

}

module.exports = {
    listAll,
    length,
    add,
    addAppointment,
    updateServiceStateSketch,
    remove,
    updateDisableStateSketchEndAt,
    updateDisableStateSketchToCanceled,
    updateAppointmentServiceDuration,
    updateAppointmentStartAt,
    cancelAppointmentService,

    setupServing,
    updateServingServiceDuration,
    pauseServing,
    resumeServing,
    finishServing,
    cancelServing,
    extraCompletedServingServiceDuration,
    resetServing,
    jumpServing,

    addUnavailableStateSketch,
    cacnelUnavailable,
    updateUnavailableStartAt,
    updateUnavailableEndAt
}