const {logger} = require('../logger/firebase.logger');

const MasterStateSketchRepository = require('../repositories/master_state_sketch.repository');
const {MasterStateSketchDisableModel,MasterStateSketchServiceModel} = require('../models/master_state_sketch.model');
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


/// warning: service state update to "Paused" will not update assertCompletedAt
///         update service state to "Paused" will not trigger when service state is not "Serving"
/// update service state to "Serving" should provide assertCompletedAt
/// all date string should convert to Date object before pass to this function

const updateServiceStateSketch = async function(uid,guid, updatedFields){
    logger.info(`[service] updateServiceStateSketch: uid=${uid}, guid=${guid}`);
    logger.debug(`[service] updateServiceStateSketch: uid=${uid}, guid=${guid}, updatedFields=${JSON.stringify(updatedFields)}`);
    // get current disable state sketch from db
    let serviceStateSketch = await MasterStateSketchRepository.get(uid,guid);
    // check model is found from repository
    if(serviceStateSketch == null){
        logger.info(`[service] updateServiceStateSketch: $uid=${uid}, guid=${guid} is not found`);
        return false;
    }
    // check model from repository is MasterStateSketchServiceModel 
    if(!(serviceStateSketch instanceof MasterStateSketchServiceModel)){
        logger.info(`[service] updateServiceStateSketch: serviceStateSketch=${guid} is not MasterStateSketchServiceModel`);
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
    // check model from repository is MasterStateSketchDisableModel
    if(!(disableStateSketch instanceof MasterStateSketchDisableModel)){
        logger.warn(`[service] updateDisableStateSketchEndAt: id=${uid}, guid=${guid} is not MasterStateSketchDisableModel`);
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
 * 
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
    // check model from repository is MasterStateSketchDisableModel
    if(!(disableStateSketch instanceof MasterStateSketchDisableModel)){
        logger.warn(`[service] updateDisableStateSketchEndAt: model is not MasterStateSketchDisableModel`);
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

module.exports = {
    listAll,
    length,
    add,
    updateServiceStateSketch,
    remove,
    updateDisableStateSketchEndAt,
    updateDisableStateSketchToCanceled
}