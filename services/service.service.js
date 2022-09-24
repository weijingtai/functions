const serviceRepository = require('../repositories/service.repository');
const orderRepository = require('../repositories/order.repository');
const {logger} = require('../logger/firebase.logger');
const { ServiceStateEnum } = require('../models/service_state.enum');

const deleteService = async (guid,operatorUid,deletedAt) => {
    logger.info(`[service] delete service`, {structuredData: true});
    // get assign by guid
    let service = await serviceRepository.getService(guid);
    // if assign not found, return null
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    // check assign status
    // if (service.state == ServiceStateEnum.Accepted){
    //     logger.info(`[service] service state is ${service.state}, can not delete`, {structuredData: true});
    //     return false;
    // }
    
    // update assign to send
    logger.info(`[service] service state is ${service.state}, delete`, {structuredData: true});
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        deletedAt:deletedAt!=null?deletedAt.toISOString():new Date().toISOString(),
        state:ServiceStateEnum.Deleted.toString()});
    return true;
}
const getService = async (guid) => {
    logger.info(`[service] get service`, {structuredData: true});
    logger.debug(`[service] get service by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    return service;

}
const listServiceByOrderGuid = async (orderGuid) => {
    logger.info(`[service] list service by order guid`, {structuredData: true});
    logger.debug(`[service] list service by order guid: ${orderGuid}`, {structuredData: true});
    let services = await serviceRepository.listServiceByOrderGuid(orderGuid);
    if (services == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${services}`, {structuredData: true});
    return services;
}
const updateServiceToNoAssign = async (guid,operatorUid,updateAt) => {
    logger.info(`[service] update service to no master`, {structuredData: true});
    logger.debug(`[service] update service to no master by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    await serviceRepository.updateService(guid,{
        assignedMasterUid:null,
        assignGuid:null,
        lastModifiedByUid: operatorUid,
        lastModifiedAt:updateAt!=null?updateAt.toISOString():new Date().toISOString(),
        state:ServiceStateEnum.NoMasterSelected.toString()});
    return true;
}
const updateServiceToPreparing = async (guid,operatorUid,assignGuid,updateAt) => {
    logger.info(`[service] update service to preparing`, {structuredData: true});
    logger.debug(`[service] update service to preparing by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        assignGuid:assignGuid,
        lastModifiedAt:updateAt!=null?updateAt.toISOString():new Date().toISOString(),
        state:ServiceStateEnum.Preparing.toString()});
    return true;
}
const updateServiceToAssigning = async (guid,operatorUid,updateAt) => {
    logger.info(`[service] update service to assigning`, {structuredData: true});
    logger.debug(`[service] update service to assigning by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:updateAt!=null?updateAt.toISOString():new Date().toISOString(),
        state:ServiceStateEnum.Assigning.toString()});
    return true;
}
/// when service is not containes appointmentStartAt/totalServiceMinutes,
/// method will get order's appointmentStartAt and totalServiceMinutes and update service
const updateServiceToWaiting = async (guid,operatorUid,assignMasterUid,updateAt) => {
    logger.info(`[service] update service to waiting`, {structuredData: true});
    logger.debug(`[service] guid: ${guid}, operatorUid: ${operatorUid}, assignMasterUid: ${assignMasterUid} ,updateAt: ${updateAt.toISOString()}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${JSON.stringify(service.toJson())}`, {structuredData: true});
    var timeAtStr = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    var updatedFileds = {
        lastModifiedByUid: operatorUid,
        assignedMasterUid: assignMasterUid,
        acceptedAt:timeAtStr,
        lastModifiedAt:timeAtStr,
        state:ServiceStateEnum.Waiting.toString()}
    // when old service is not containes appointmentStartAt/totalServiceMinutes,
    // method will get order's appointmentStartAt and totalServiceMinutes and update service
    if(service.appointmentStartAt==null || service.totalServiceMinutes==null){
        let order = await orderRepository.getActivatedOrder(service.orderGuid);
        if(order==null){
            logger.info(`[service] order not found`, {structuredData: true});
            return null;
        }
        logger.info(`[service] order found`, {structuredData: true});
        if (service.appointmentStartAt==null){
        updatedFileds.appointmentStartAt = order.appointmentStartAt;
        }
        if (service.totalServiceMinutes==null){
        updatedFileds.totalServiceMinutes = order.totalMinutes;
        }
    }
    

    // when totalServiceMinutes is null, get order's totalServiceMinutes
    // let order;
    // if (service.totalServiceMinutes == null){
    //     order = await orderRepository.getActivatedOrder(service.orderGuid);
    //     updatedFileds.totalServiceMinutes = order.totalServiceMinutes;
    // }
    // if (service.appointmentStartAt == null){
    //     if (order == null){
    //         order = await orderRepository.getActivatedOrder(service.orderGuid);
    //     }
    //     updatedFileds.appointmentStartAt = order.appointmentStartAt;
    // }
    logger.debug(`[service] update service to ${JSON.stringify(updatedFileds)}`, {structuredData: true});

    await serviceRepository.updateService(guid,updatedFileds);
    return true;
}
// only setup service appointmentStartAt、totalServiceMinutes 
// when they are null
const setupService = async (guid,operatorUid,appointmentStartAt,totalServiceMinutes,updateAt) => {
    logger.info(`[service] setup service appointmentStartAt and totalServiceMinutes`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAtStr = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    var updatedField = {
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAtStr,
    }
    if (service.appointmentStartAt == null){
        updatedField.appointmentStartAt = appointmentStartAt;
    }
    if (service.totalServiceMinutes == null){
        updatedField.totalServiceMinutes = totalServiceMinutes;
    }
    // only update with some fields is null
    if (service.appointmentStartAt || service.totalServiceMinutes){
        await serviceRepository.updateService(guid,updatedField);
    }


}

const updateServiceToMasterSetSail = async (guid,operatorUid,updateAt) => {
    logger.info(`[service] update service to MasterSetSail`, {structuredData: true});
    logger.debug(`[service] update service to MasterSetSail by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAtStr = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAtStr,
        state:ServiceStateEnum.MasterSetSail.toString()});
    return true;
}
const updateServiceToCustomerArrived = async (guid,operatorUid,updateAt) => {
    logger.info(`[service] update service to customer arrived`, {structuredData: true});
    logger.debug(`[service] update service to customer arrived by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAtStr = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAtStr,
        state:ServiceStateEnum.CustomerArrived.toString()});
    return true;
}
const updateServiceToRunning = async (guid,operatorUid,updateAt) => {
    logger.info(`[service] update service to running`, {structuredData: true});
    logger.debug(`[service] update service to running by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:updateAt!=null?updateAt.toISOString():new Date().toISOString(),
        state:ServiceStateEnum.Running.toString()});
    return true;
}
const updateServiceToServing = async (guid,operatorUid,assertCompletedAt,updateAt) => {
    logger.info(`[service] update service to started`, {structuredData: true});
    logger.debug(`[service] update service to started by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var startedAt = updateAt!=null?updateAt:new Date();
    var startedAtStr = startedAt.toISOString();
    var updatedData = {
        lastModifiedByUid: operatorUid,
        lastModifiedAt:startedAtStr,
        assertCompletedAt: assertCompletedAt.toISOString(),
        state:ServiceStateEnum.Serving.toString()};
    if ([ServiceStateEnum.CustomerArrived,
        ServiceStateEnum.Waiting,
        ServiceStateEnum.Running].includes(service.state)) {
            updatedData.startedAt = startedAtStr
            updatedData.completedSeconds = 0
        }else{
            updatedData.pausedAt = null;
        }
    await serviceRepository.updateService(guid,updatedData);
    return true;
}
const updateServiceToPaused = async (guid,operatorUid,completedSeconds,updateAt) => {
    logger.info(`[service] update service to paused`, {structuredData: true});
    logger.debug(`[service] update service to paused by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var lastModifiedAtStr = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        completedSeconds: completedSeconds,
        assertCompletedAt: null,
        pausedAt: lastModifiedAtStr,
        lastModifiedAt:lastModifiedAtStr,
        state:ServiceStateEnum.Paused.toString()});
    return true;
}

/// method will remove assertCompletedAt
/// and set final completed seconds
const updateServiceToEnd = async (guid,operatorUid,completedSeconds,endAt) => {
    logger.info(`[service] update service to end`, {structuredData: true});
    logger.debug(`[service] update service to end by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = endAt!=null?endAt:new Date();
    var timeStr = timeAt.toISOString();
    // when completed seconds is equal or greater than total service minutes
    // end state is completed
    var endStateStr = ServiceStateEnum.Finished.toString();
    if (completedSeconds >= service.totalServiceMinutes * 60){
        endStateStr = ServiceStateEnum.Completed.toString();
    }
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        completedSeconds: completedSeconds,
        assertCompletedAt: null,
        pausedAt: null,
        doneAt: timeStr,
        state:endStateStr});
    return true;
}

const updateServiceToCanceled = async (guid,operatorUid,completedSeconds,canceledAt) => {
    logger.info(`[service] update service to canceled`, {structuredData: true});
    logger.debug(`[service] update service to canceled by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = canceledAt!=null?canceledAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        startedAt: null,
        completedSeconds: completedSeconds,
        assertCompletedAt: null,
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        canceledAt:timeAt,
        doneAt: null,
        state:ServiceStateEnum.Canceled.toString()});
    return true;
}

const resetService = async (guid,operatorUid,resetAt) => {
    logger.info(`[service] update service to reset`, {structuredData: true});
    logger.debug(`[service] update service to reset by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = resetAt!=null?resetAt.toISOString():new Date().toISOString();
    // check service state
    // when is serving, re-calculate assertCompletedAt
    let assertCompletedAt = null;
    if (service.assertCompletedAt != null){
        assertCompletedAt = new Date(resetAt);
        assertCompletedAt.setMinutes(assertCompletedAt.getMinutes() + service.totalServiceMinutes);
    }
    var newState = service.state;
    if (![ServiceStateEnum.Serving,ServiceStateEnum.Paused].includes(service.state)){
        newState = ServiceStateEnum.Waiting;
    }
    await serviceRepository.updateService(guid,{
        startedAt: assertCompletedAt != null?resetAt.toISOString():null,
        completedSeconds: 0,
        assertCompletedAt: assertCompletedAt != null?assertCompletedAt.toISOString():null,
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        canceledAt:null,
        doneAt: null,
        state:newState.toString()});
}
const replaceService = async (guid,operatorUid,replaceByGuid,completedSeconds,operatedAt) => {
    logger.info(`[service] update service to replace`, {structuredData: true});
    logger.debug(`[service] update service to replace by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = operatedAt!=null?operatedAt.toISOString():new Date().toISOString();
    // when service assertCompletedAt is not null
    // set assertCompletedAt to null
    // and calculate completed seconds
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        assertCompletedAt: null,
        doneAt: service.assertCompletedAt != null?timeAt:null,
        completedSeconds: completedSeconds,
        replaceByServiceGuid:replaceByGuid,
        state:ServiceStateEnum.Replaced.toString()});
    return true;

}

const updateServiceToReplaced = async (guid,operatorUid,replaceByServiceGuid,replaceAt) => {
    logger.info(`[service] update service to Replaced`, {structuredData: true});
    logger.debug(`[service] update service to Replaced by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = replaceAt!=null?replaceAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        replaceByServiceGuid:replaceByServiceGuid,
        state:ServiceStateEnum.Replaced.toString()});
    return true;
}
const updateServiceAppointmentStartAt = async (guid,operatorUid,appointmentStartAt,updateAt) => {
    // appointmentStartAt should not be past time
    if (appointmentStartAt.getTime()<new Date().getTime()) {
        logger.warn(`[service] appointmentStartAt should not be past time`, {structuredData: true});
        return false;
    }
    logger.info(`[service] update service to appointment`, {structuredData: true});
    logger.debug(`[service] update service to appointment by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] service found: ${appointmentStartAt.toISOString()}`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    var timeAt = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    await serviceRepository.updateService(guid,{
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        appointmentStartAt:appointmentStartAt.toISOString()});
    return true;

}

/// update totalMinutes
/// when  AssertCompletedAt is not null, re-calculate it by new totalMinutes
///    add changedMinutes
const updateServiceTotalMinutes = async (guid,operatorUid,totalMinutes,updateAt) => {
    if (totalMinutes < 0){
        logger.warn(`[service] totalMinutes is less than 0`, {structuredData: true});
        return false;
    }
    logger.info(`[service] update service to total minutes`, {structuredData: true});
    logger.debug(`[service] update service to total minutes by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    // if assertCompletedAt is not null,
    // re-calculate assertCompletedAt
    var timeAt = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    var updatedFields = {
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        totalServiceMinutes:totalMinutes}
    if (service.assertCompletedAt != null) {
        var oldTotalMinutes = service.totalServiceMinutes;
        var changedMinutes = totalMinutes - oldTotalMinutes
        logger.debug(`[service] service assertCompletedAt is not null, re-calculate assertCompletedAt by changed minutes:${changedMinutes}`, {structuredData: true});
        var newAssertCompletedAt = new Date(service.assertCompletedAt.getTime() + changedMinutes * 60000);
        updatedFields.assertCompletedAt = newAssertCompletedAt.toISOString();
        // assertCompletedAt.setMinutes(assertCompletedAt.getMinutes() + totalMinutes);
        // service.assertCompletedAt = assertCompletedAt.toISOString();
    }
    logger.info(`[service] service found`, {structuredData: true});
    logger.debug(`[service] ${service.toJson()}`, {structuredData: true});
    await serviceRepository.updateService(guid,updatedFields);
    return true;
}

/// this method must provide completedSeconds and assertCompletedAt
/// for example when service reset
/// completedSeconds is 0; assertCompletedAt is should be null or new evaluated datetime
const updateServiceCompletedSeconds = async (guid,operatorUid,completedSeconds,updateAt) => {
    if (completedSeconds < 0){
        logger.warn(`[service] completedSeconds is less than 0`, {structuredData: true});
        return false;
    }
    logger.info(`[service] update service to completed time ${completedSeconds}`, {structuredData: true});
    logger.debug(`[service] update service to completed time by guid: ${guid}`, {structuredData: true});
    let service = await serviceRepository.getService(guid);
    if (service == null) {
        logger.info(`[service] service not found`, {structuredData: true});
        return null;
    }
    // re-calculate assertCompletedAt, only when assertCompletedAt is not null
    var timeAt = updateAt!=null?updateAt.toISOString():new Date().toISOString();
    var updatedFields = {
        lastModifiedByUid: operatorUid,
        lastModifiedAt:timeAt,
        completedSeconds:completedSeconds,};
    if (service.assertCompletedAt != null) {
        var oldCompletedSeconds = service.completedSeconds;
        var changedSeconds = completedSeconds - oldCompletedSeconds

        logger.debug(`[service] service assertCompletedAt is not null, re-calculate assertCompletedAt by changed seconds:${changedSeconds}`, {structuredData: true});
        var newAssertCompletedAt = new Date(service.assertCompletedAt.getTime() - changedSeconds * 1000);
        // check if newAssertCompletedAt is past time
        if (newAssertCompletedAt.getTime()<new Date().getTime()) {
            logger.error(`[service] newAssertCompletedAt is past time`, {structuredData: true});
        }else{
            updatedFields.assertCompletedAt = newAssertCompletedAt.toISOString();
            logger.info(`[service] update service`, {structuredData: true});
            await serviceRepository.updateService(guid,updatedFields);
            return true;
        }
    }
    logger.info(`[service] update service`, {structuredData: true});
    await serviceRepository.updateService(guid,updatedFields);
    return true;



}

const countWaitingServiceByOrderGuid = async (orderGuid) => {
    logger.info(`[service] count waiting service by order guid`, {structuredData: true});
    logger.debug(`[service] count waiting service by order guid: ${orderGuid}`, {structuredData: true});
    let totalWaitingNumber = await serviceRepository.countServiceByOrderGuidWithState(orderGuid,ServiceStateEnum.Waiting);
    logger.info(`[service] total waiting number: ${totalWaitingNumber}`, {structuredData: true});
    return totalWaitingNumber;

}

module.exports = {
    getService,
    deleteService,
    updateServiceToNoAssign,
    updateServiceToPreparing,
    updateServiceToAssigning,
    updateServiceToWaiting,
    updateServiceToMasterSetSail,
    updateServiceToCustomerArrived,
    updateServiceToRunning,
    updateServiceToServing,
    updateServiceToPaused,
    updateServiceToEnd,
    updateServiceToCanceled,
    updateServiceToReplaced,
    updateServiceAppointmentStartAt,
    updateServiceCompletedSeconds,
    updateServiceTotalMinutes,
    setupService,
    resetService,
    replaceService,

    listServiceByOrderGuid,
    countWaitingServiceByOrderGuid
}
