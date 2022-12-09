const {logger} = require('../logger/firebase.logger');
const ServiceModel = require('../models/service.model');
const { ServiceStateEnum,isReadyToServingState,isDoingServiceState} = require('../models/service_state.enum');
const serviceService = require('../services/service.service');
const orderService = require('../services/order.service');
const { OrderStatusEnum } = require('../models/order.enum');
const { service } = require('firebase-functions/v1/analytics');
const MasterStateSketchService = require('../services/master_state_sketch.service');

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
    let oldServiceModel = oldService;
    let newServiceModel = newService;
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
            if (isReadyToServingState(oldService.state)){
                await whenServiceStartToServing(newServiceModel);
            }else if (oldService.state == ServiceStateEnum.Paused){
                await whenServiceResumed(newServiceModel);
            } else if (oldService.state == ServiceStateEnum.Completed){
                logger.debug(`[handler] service state is Serving, but oldService state is Completed`, {structuredData: true});
                let changedMinutes = newServiceModel.totalServiceMinutes - oldService.totalServiceMinutes;
                if (changedMinutes>0){
                    logger.debug(`[handler] service add an extra service minutes ${changedMinutes}`, {structuredData: true});
                    await whenServiceAddExtraServiceMinutes(newServiceModel,changedMinutes);
                }
            } else if (oldService.state == ServiceStateEnum.Finished){
                if (oldService.doneAt != null && newServiceModel.doneAt == null){
                    logger.info(`[handler] service reset when it's finished, and start serving directly`, {structuredData: true});
                    await whenServiceReset(oldService, newServiceModel);
                }else{
                    throw new Error("Unimplemented. when service state is Serving, but oldService state is ${oldService.state}")
                }
            } 
            break;
        case ServiceStateEnum.Paused:
            if (newServiceModel.assignedMasterUid != null){
                if (oldService.state == ServiceStateEnum.Serving){
                    await whenServicePaused(newServiceModel);
                }else if (oldService.state == ServiceStateEnum.Paused){
                    logger.info(`[handler] service state is Paused, but oldService state is also Paused`, {structuredData: true});
                }else{
                    if (oldService.doneAt != null && newServiceModel.doneAt == null){
                        logger.info(`[handler] service reset when it's Finished, and Pause current service `, {structuredData: true});
                        await whenServiceReset(oldService, newServiceModel);
                    }else{
                    logger.warn(`[handler] when service state is Paused, but oldService state is ${oldService.state}`, {structuredData: true});
                        throw new Error(`Unimplemented. when service state is Paused, but oldService state is ${oldService.state}`)
                    }
                }
            }else{
                logger.warn(`[handler] service state is Paused, but assignedMasterUid is null`, {structuredData: true});
            }
            break;
        case ServiceStateEnum.Finished:
        case ServiceStateEnum.Completed:
            if (isDoingServiceState(oldService.state)){
                await whenServiceStateToFinished(newServiceModel);
            }else{
                logger.warn(`[handler] service state is Finished or Completed, but oldService state is not Serving or Paused`, {structuredData: true});
            }
            break;
        case ServiceStateEnum.Canceled:
            // when assignedMasterUid exits
            if(newServiceModel.assignedMasterUid != null){
                if (isReadyToServingState(newServiceModel.state)){
                    await MasterStateSketchService.cancelAppointmentService(newServiceModel);
                }else if (isDoingServiceState(oldService.state)){
                    await MasterStateSketchService.cancelServing(newServiceModel,newServiceModel.canceledAt);
                }
            }
            break;
        case ServiceStateEnum.Replaced:
            if(newServiceModel.assignedMasterUid != null){
                if (isReadyToServingState(oldService.state)){
                    await MasterStateSketchService.cancelAppointmentService(newServiceModel);
                }else if (isDoingServiceState(oldService.state)){
                    await MasterStateSketchService.cancelServing(newServiceModel,newServiceModel.canceledAt);
                }
            }
            break; 
        case ServiceStateEnum.Deleted:
            // when assignedMasterUid exits
            if(newServiceModel.assignedMasterUid != null){
                if (isReadyToServingState(newServiceModel.state)){
                    await MasterStateSketchService.cancelAppointmentService(newServiceModel);
                }else if (isDoingServiceState(oldService.state)){
                    await MasterStateSketchService.cancelServing(newServiceModel,newServiceModel.deletedAt);
                }
            }
            break;
    }
}
async function whenServiceAddExtraServiceMinutes(service,increasedMinutes){
    logger.info(`[handler] when service add extra service minutes`, {structuredData: true});
    await MasterStateSketchService.extraCompletedServingServiceDuration(service,increasedMinutes);
}
async function whenServiceResumed(service){
    logger.info(`[handler] when service resumed`, {structuredData: true});
    await MasterStateSketchService.resumeServing(service);
}
async function whenServicePaused(service){
    logger.info(`[handler] when service paused`, {structuredData: true});
    await MasterStateSketchService.pauseServing(service);
}

/// service state updated to Serving
/// when service state updated to Serving, we need to update order status to Serving
async function whenServiceStartToServing(service){
    // 1. try update order status to Serving
    logger.info(`[handler] whenServiceStartToServing`, {structuredData: true});
    logger.debug(`[handler] update order status to Serving.`, {structuredData: true});
    await orderService.updateOrderStatusToServing(service.orderGuid,service.operatorUid,new Date());

    // 2. try setup this service to online master state sketch
    logger.debug(`[handler] setup this service to online master state sketch.`, {structuredData: true});
    await MasterStateSketchService.setupServing(service);
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

    // 2. update master state sketch
    await MasterStateSketchService.finishServing(serivce,serivce.state);


}

async function whenServiceTotalServiceMinutesChanged(preService,curService){
    logger.info(`[handler] when service total service minutes changed`, {structuredData: true});
    logger.debug(`[handler] update totalServiceMinutes from ${preService.totalServiceMinutes} to ${curService.totalServiceMinutes}`, {structuredData: true});
    // check curService container "assignedMasterUid"
    if (curService.assignedMasterUid != null){
        logger.info(`[handler] current service has been assigned to as master, update master's sketch`, {structuredData: true});
        if (isReadyToServingState(curService.state)){
            logger.info(`[handler] current service state is ${curService.state.toString()}, update appointment sketch`, {structuredData: true});
            // update master state sketch
            let res = await MasterStateSketchService.updateAppointmentServiceDuration(curService,preService.totalServiceMinutes,curService.totalServiceMinutes);
            if (res == null){
                logger.warn(`[handler] update master state sketch failed`, {structuredData: true});
            }else{
                logger.info(`[handler] update master state sketch success`, {structuredData: true});
            }
        }else if (isDoingServiceState(curService.state)){
            logger.info(`[handler] current service state is ${curService.state.toString()}, update serving sketch`, {structuredData: true});
            let totalChangedMinutes = curService.totalServiceMinutes - preService.totalServiceMinutes;
            let res = await MasterStateSketchService.updateServingServiceDuration(curService,totalChangedMinutes);
            if (res == null){
                logger.warn(`[handler] update master state sketch failed`, {structuredData: true});

            }else{
                logger.debug(`[handler] update master state sketch success`, {structuredData: true});
            }
        }
    }

}
async function whenServiceStartAtChanged(preService,curService){
    logger.info(`[handler] when service total service minutes changed`, {structuredData: true});
    logger.debug(`[handler] update startAt from ${preService.appointmentStartAt} to ${curService.appointmentStartAt}`, {structuredData: true});
    // check curService container "assignedMasterUid"
    if (curService.assignedMasterUid != null){
        logger.info(`[handler] current service has been assigned to as master, update master's sketch`, {structuredData: true});
        if ([ServiceStateEnum.Waiting,
            ServiceStateEnum.MasterSetSail,
            ServiceStateEnum.CustomerArrived,
            ServiceStateEnum.Running,].includes(curService.state)){
            logger.info(`[handler] current service state is ${curService.state.toString()}, update appointment sketch`, {structuredData: true});
            // update master state sketch
            let res = await MasterStateSketchService.updateAppointmentStartAt(curService,preService.appointmentStartAt,curService.appointmentStartAt);
            if (res == null){
                logger.warn(`[handler] update master state sketch failed`, {structuredData: true});
            }else{
                logger.info(`[handler] update master state sketch success`, {structuredData: true});
            }
        }
    }
}
async function whenServiceJump(preService,curService){
    // check is forward or backward jump
    let previousCompletedSeconds = preService.completedSeconds;
    let currentCompletedSeconds = curService.completedSeconds;
    let seconds = currentCompletedSeconds - previousCompletedSeconds
    // let isForwardJump = ;
    logger.info(`[handler] when service jump time ${seconds}`, {structuredData: true});
    logger.debug(`[handler] update completedSeconds from ${previousCompletedSeconds} to ${currentCompletedSeconds}`, {structuredData: true});
    // when is backword jump, second parameter is negative
    let res = await MasterStateSketchService.jumpServing(curService,seconds)
    if (res){
        logger.debug(`[handler] update master state sketch success`, {structuredData: true});
    }else{
        logger.warn(`[handler] update completedSeconds failed`, {structuredData: true});
    }
    return res;
}
async function whenServiceReset(preService,curService){
    logger.info(`[handler] when service reset`, {structuredData: true});
    logger.debug(`[handler] previous: ${JSON.stringify(preService.toJson())}`, {structuredData: true});
    logger.debug(`[handler] current: ${JSON.stringify(curService.toJson())}`, {structuredData: true});
    // check curService container "assignedMasterUid"
    if (curService.assignedMasterUid != null){
        await MasterStateSketchService.resetServing(curService,curService.startedAt);
        logger.info(`[handler] reset master state sketch success`, {structuredData: true});
    }else{
        logger.warn(`[handler] current service has not been assigned to as master, do nothing`, {structuredData: true});
    }
    return ;
}

module.exports = {
    getService,
    deleteService,
    updateService,
    updateServiceAppointmentStartAt,
    updateServiceTotalMinutes,
    updateServiceCompletedSeconds,
    whenServiceStateChanged,
    whenServiceTotalServiceMinutesChanged,
    whenServiceStartAtChanged,
    whenServiceReset,
    whenServiceJump
}