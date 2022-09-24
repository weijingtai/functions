const {logger} = require('../logger/firebase.logger');
const ServiceModel = require('../models/service.model');
const { ServiceStateEnum } = require('../models/service_state.enum');
const serviceService = require('../services/service.service');
const orderService = require('../services/order.service');
const { OrderStatusEnum } = require('../models/order.enum');
const { service } = require('firebase-functions/v1/analytics');

const getService = async (guid) => {
    logger.info(`[handler] get service`, {structuredData: true});
    logger.debug(`[handler] get service by guid: ${guid}`, {structuredData: true});
    let service = await serviceService.getService(guid);
    if (service == null) {
        logger.info(`[handler] service not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] service found`, {structuredData: true});
    logger.debug(`[handler] ${service.toJson()}`, {structuredData: true});
    return service;
}
const deleteService = async (guid,operatorUid) => {
    logger.info(`[handler] delete service`, {structuredData: true});
    logger.debug(`[handler] delete service by guid: ${guid}`, {structuredData: true});
    let service = await serviceService.deleteService(guid,operatorUid);
    if (service == null) {
        logger.info(`[handler] service`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] service delete success.`, {structuredData: true});
    return service;
}
const updateService = async (guid,operatorUid,operation) => {
    var now = new Date();
    switch(operation){
        case "NoAssign":
            return await serviceService.updateServiceToNoAssign(guid,operatorUid,now);
        case "Preparing":
            return await serviceService.updateServiceToPreparing(guid,operatorUid,"f0d12b83-6809-4e93-977a-2904b590b97c",now);
        case "Assigning":
            return await serviceService.updateServiceToAssigning(guid,operatorUid,now);
        case "Waiting":
            return await serviceService.updateServiceToWaiting(guid,operatorUid,"test_master_uid",new Date(),now);
        case "Arrived":
            return await serviceService.updateServiceToCustomerArrived(guid,operatorUid,now);
        case "Running":
            return await serviceService.updateServiceToRunning(guid,operatorUid,now);
        case "Serving":
            // get assertCompletedAt from by add 60 minutes to current time
            var assertCompletedAt = new Date(now.getTime() + 60 * 60 * 1000);
            return await serviceService.updateServiceToServing(guid,operatorUid,assertCompletedAt,now);
        case "Paused":
            return await serviceService.updateServiceToPaused(guid,operatorUid,100,now);
        case "Finished":
            return await serviceService.updateServiceToEnd(guid,operatorUid,30*60,now);
        case "Completed":
            return await serviceService.updateServiceToEnd(guid,operatorUid, 61*60,now);
        case "Canceled":
            return await serviceService.updateServiceToCanceled(guid,operatorUid,0,now);
        case "Replaced":
            return await serviceService.updateServiceToReplaced(guid,operatorUid,"00000000-0000-0000-0000-000000000000",now);

    }
}

const updateServiceAppointmentStartAt = async (guid,operatorUid,appointmentStartAt) => {
    return await serviceService.updateServiceAppointmentStartAt(guid,operatorUid,appointmentStartAt,new Date());
}
const updateServiceTotalMinutes = async (guid,operatorUid,newToalMinutes) => {
    return await serviceService.updateServiceTotalMinutes(guid,operatorUid,newToalMinutes,new Date());
}
const updateServiceCompletedSeconds = async (guid,operatorUid,completedSeconds) => {
    return await serviceService.updateServiceCompletedSeconds(guid,operatorUid,completedSeconds,new Date());
}

const whenServiceStateChanged = async (oldService,newService) => {
    let oldServiceModel = ServiceModel.fromJson(oldService);
    let newServiceModel = ServiceModel.fromJson(newService);
    logger.info(`[handler] when service state changed`, {structuredData: true});
    logger.debug(`[handler] newService: ${JSON.stringify(newServiceModel.toJson())}`, {structuredData: true});

    // handle new service state with switch-case
    switch(newServiceModel.state){
        case ServiceStateEnum.NoMasterSelected:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Preparing:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Assigning:
            // throw new Error("Unimplemented.")
            // await whenServiceStateToAssigning(newServiceModel);
            break;
        case ServiceStateEnum.Waiting:
            await whenServiceStateToWaiting(newServiceModel);
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.MasterSetSail:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.CustomerArrived:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Running:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Serving:
            await whenServiceStateToServing(newServiceModel);
            break;
        case ServiceStateEnum.Paused:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Finished:
        case ServiceStateEnum.Completed:
            whenServiceStateToFinished(newServiceModel);
            break;
        case ServiceStateEnum.Canceled:
            // throw new Error("Unimplemented.")
            break;
        case ServiceStateEnum.Replaced:
            // throw new Error("Unimplemented.")
            break; 
        case ServiceStateEnum.Deleted:
            // throw new Error("Unimplemented.")
            break;
    }
}

/// service state updated to Serving
/// when service state updated to Serving, we need to update order status to Serving
async function whenServiceStateToServing(service){
    // 1. try update order status to Serving
    logger.info(`[handler] whenServiceStateToServing`, {structuredData: true});
    logger.debug(`[handler] update order status to Serving.`, {structuredData: true});
    await orderService.updateOrderStatusToServing(service.orderGuid,service.operatorUid,new Date());
    return 
}


/// service state updated to Waiting
/// when order's status is Assigning
/// update orders's status to Waiting
async function whenServiceStateToWaiting(service){
    logger.info(`[handler] when service state to Waiting`, {structuredData: true});
    // 1. update order to waiting
    await orderService.updateActivatedOrderToWaiting(service.orderGuid);
}

/// service state updated to Finished/Completed
/// when order's status is Serving
/// update orders's status to Completed
async function whenServiceStateToFinished(serivce){
    logger.info(`[handler] when service state to ${service.state}`, {structuredData: true});
    // get order by service.orderGuid
    // 1. update order to completed
    await orderService.updateActivatedOrderToCompleted(serivce.orderGuid);


}

module.exports = {
    getService,
    deleteService,
    updateService,
    updateServiceAppointmentStartAt,
    updateServiceTotalMinutes,
    updateServiceCompletedSeconds,
    whenServiceStateChanged
}