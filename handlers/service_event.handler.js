const {logger} = require('../logger/firebase.logger');
const { ServiceEventTypeEnum,AppointmentEventTypeEnum,ServingServiceEventTypeEnum, OthersEventTypeEnum } = require('../models/service_event.enum');
const serviceEventService = require('../services/service_event.service');
const orderService = require('../services/order.service');
const serviceService = require('../services/service.service');
const { service } = require('firebase-functions/v1/analytics');
const AssignEventEnum = require('../models/assign.enum').AssignEventEnum;


const serviceAssign = async(serviceGuid, assignGuid, operatorUid,masterUid,event) => {
    logger.info(`[handler] ${event}`, {structuredData: true});
    logger.debug(`[handler] ${event} to assignGuid: ${assignGuid}`, {structuredData: true});
    let res;
    switch (event) {
        case "select":
            res = await serviceEventService.selectMasterServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
        case "unselect":
            res = await serviceEventService.unselectMasterServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
        case "send":
            res = await serviceEventService.sendAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
        case "cancel":
            res = await serviceEventService.cancelAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
        case "accept":
            res = await serviceEventService.acceptAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
        case "reject":
            res = await serviceEventService.rejectAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,new Date());
            break;
    }


    logger.info(`[handler] ${event} added finished.`, {structuredData: true});
    // logger.debug(`[handler] ${res.toJson()}.`, {structuredData: true});
    return res;

}

const serviceAppointment = async(serviceGuid, operatorUid,event,body) => {
    logger.info(`[handler] ${event}`, {structuredData: true});
    logger.debug(`[handler] ${event} to serviceGuid: ${serviceGuid} with body: ${JSON.stringify(body)}`, {structuredData: true});
    let res;
    switch (event) {
        case "setup":
            res = await serviceEventService.addServiceSetupEvent(serviceGuid,operatorUid,body.appointmentStartAt,body.totalServiceMinutes,new Date());
            break;
        case "start":
            res = await serviceEventService.addServiceUpdateAppointmentStartAtEvent(serviceGuid,operatorUid,body.from,body.to,new Date());
            break;
        case "minutes":
            res = await serviceEventService.addServiceUpdateTotalServiceMinutesEvent(serviceGuid,operatorUid,body.from,body.to,new Date());
            break;
        case "replace":
            res = await serviceEventService.addServiceReplaceEvent(serviceGuid,operatorUid,body.replacedByServiceGuid,new Date());

    }

    logger.info(`[handler] ${event} added finished.`, {structuredData: true});
    logger.debug(`[handler] ${res.toJson()}.`, {structuredData: true});
    return res;



}
const serviceOthersEvent = async(serviceGuid, operatorUid,event) => {
    logger.info(`[handler] ${event}`, {structuredData: true});
    switch (OthersEventTypeEnum[event]) {
        case OthersEventTypeEnum.CustomerArrived:
            return await serviceEventService.addOthersCustomerArrived(serviceGuid,operatorUid,new Date());
        case OthersEventTypeEnum.MasterOnTheWay:
            return await serviceEventService.addMasterOnTheWay(serviceGuid,operatorUid,new Date());
        case OthersEventTypeEnum.MasterSetSail:
            return await serviceEventService.addMasterSetSail(serviceGuid,operatorUid,new Date());

    }
}
function _getAssertCompletedAt(service){
    // calculate assertCompletedAt
    var totalServiceMilliseconds= service.totalServiceMinutes * 60000;
    
    let leftMilliseconds = totalServiceMilliseconds;
    if (service.completedSeconds > 0) {
        leftMilliseconds = leftMilliseconds -  service.completedSeconds * 1000;
    }
    return new Date(operatedAt.getTime() + leftMilliseconds);

}
const serviceServing = async(serviceGuid, operatorUid,event,body) => {
    logger.debug(`[handler] ${serviceGuid}, ${operatorUid}, ${event}`, {structuredData: true});
    switch (event) {
        case "start":
            return await serviceEventService.addStartServing(serviceGuid,operatorUid,new Date());
            break;
        case "pause":
            return await serviceEventService.addPauseServing(serviceGuid,operatorUid,new Date());
            break;
        case "resume":
            return await serviceEventService.addResumeServing(serviceGuid,operatorUid,new Date());
            break;
        case "cancel":
            return await serviceEventService.addCancelServing(serviceGuid,operatorUid,new Date());
            break;
        case "done":
            return await serviceEventService.addDoneServing(serviceGuid,operatorUid,new Date());
            break;
        case "reset":
            logger.info(`[handler] reset serving event.`, {structuredData: true});
            return await serviceEventService.addResetServing(serviceGuid,operatorUid,new Date());
        case "jump":
            return await serviceEventService.addJumpToServing(serviceGuid,operatorUid,body.to,new Date());
            
    }
}
const whenServiceEventAdded = async (serviceEventJson) => {
    logger.info(`[handler] whenServiceEventAdded {serviceEventJson.type}`, {structuredData: true});
    var serviceEventType =  ServiceEventTypeEnum[serviceEventJson.type];
    logger.info(`[handler] service with ${serviceEventJson.type} event.`, {structuredData: true});
    // handle service event type by switch case
    switch (serviceEventType) {
        case ServiceEventTypeEnum.Assign:
            await handleAssignEvent(serviceEventJson);
            // await serviceAssign(serviceEventJson.serviceGuid, serviceEventJson.assignGuid, serviceEventJson.operatorUid, serviceEventJson.masterUid, AssignEventEnum.Send.toString());
            break;
        case ServiceEventTypeEnum.Appointment:
            await handleAppointmentInfoEvent(serviceEventJson);
            break;
        case ServiceEventTypeEnum.Serving:
            await handleServingEvent(serviceEventJson);
            break;
        case ServiceEventTypeEnum.Others:
            logger.debug(`[handler] others event.`, {structuredData: true});
            await handleOthersEvent(serviceEventJson);
            break;
    }

}
async function handleAssignEvent(serviceEventJson) {
    var assignEventType = AssignEventEnum[serviceEventJson.event];
    let serviceGuid = serviceEventJson.serviceGuid;
    let assignGuid = serviceEventJson.assignGuid;
    let operatorUid = serviceEventJson.operatorUid;
    let masterUid = serviceEventJson.assignMasterUid;
    let operatedAt = new Date(serviceEventJson.operatedAt);
    logger.info(`[handler] service with ${assignEventType} event.`, {structuredData: true});
    logger.debug(`[handler] ${JSON.stringify(serviceEventJson)}`, {structuredData: true});
    let res;
    switch (assignEventType) {
        case AssignEventEnum.Init:
            res = await serviceService.updateServiceToPreparing(serviceGuid,operatorUid,assignGuid,operatedAt);
            break;
        case AssignEventEnum.Delete:
            res = await serviceService.updateServiceToNoAssign(serviceGuid,operatorUid,operatedAt);
            break;
        case AssignEventEnum.Send:
            res = await serviceService.updateServiceToAssigning(serviceGuid, operatorUid,operatedAt);
            break;
        case AssignEventEnum.Cancel:
            res = await serviceService.updateServiceToPreparing(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt);
            break;
        case AssignEventEnum.Accept:
            // if (await setupServiceFromOrder(serviceGuid, operatorUid, operatedAt) == null){
            //     return null;
            // }
            res = await serviceService.updateServiceToWaiting(serviceGuid, operatorUid,masterUid,operatedAt);
            break;
        case AssignEventEnum.Reject:
            res = await serviceService.updateServiceToPreparing(serviceGuid, operatorUid,assignGuid, operatedAt);
            break;
    }


    logger.info(`[handler] ${assignEventType} added finished.`, {structuredData: true});
    // logger.debug(`[handler] ${res.toJson()}.`, {structuredData: true});
    return res;

}

async function handleOthersEvent(serviceEventJson) {
    var othersEventType = OthersEventTypeEnum[serviceEventJson.event];
    let operatedAt = new Date(serviceEventJson.operatedAt);
    let guid = serviceEventJson.serviceGuid;
    let operatorUid = serviceEventJson.operatorUid;
    switch (othersEventType) {
        case OthersEventTypeEnum.CustomerArrived:
            logger.info(`[handler] customer arrived event.`, {structuredData: true});
            await serviceService.updateServiceToCustomerArrived(guid,operatorUid,operatedAt);
            break;
        case OthersEventTypeEnum.MasterOnTheWay:
            logger.info(`[handler] master on the way event.`, {structuredData: true});
            await serviceService.updateServiceToRunning(guid,operatorUid,operatedAt);
            break;
        case OthersEventTypeEnum.MasterSetSail:
            logger.info(`[handler] master set sail event.`, {structuredData: true});
            await serviceService.updateServiceToMasterSetSail(guid,operatorUid,operatedAt);
            break;
    }
}
async function handleServingEvent(serviceEventJson) {
    let operatedAt = new Date(serviceEventJson.operatedAt);
    let guid = serviceEventJson.serviceGuid;
    let operatorUid = serviceEventJson.operatorUid;
    // let eventStr = serviceEventJson.event;


    // handle service event type by switch case
    switch (ServingServiceEventTypeEnum[serviceEventJson.event]) {
        case ServingServiceEventTypeEnum.Start:
            await serviceService.updateServiceToServing(guid,operatorUid,new Date(serviceEventJson.assertCompletedAt),operatedAt);
            break;
        case ServingServiceEventTypeEnum.Pause:
            await serviceService.updateServiceToPaused(guid,operatorUid,serviceEventJson.completedSeconds,operatedAt);
            break;
        case ServingServiceEventTypeEnum.Resume:
            await serviceService.updateServiceToServing(guid,operatorUid,new Date(serviceEventJson.assertCompletedAt),operatedAt);
            break;
        case ServingServiceEventTypeEnum.Cancel:
            await serviceService.updateServiceToCanceled(guid,operatorUid,serviceEventJson.completedSeconds,operatedAt);
            break;
        case ServingServiceEventTypeEnum.Done:
            await serviceService.updateServiceToEnd(guid,operatorUid,serviceEventJson.completedSeconds,operatedAt);
            break;
        case ServingServiceEventTypeEnum.Reset:
            await serviceService.resetService(guid,operatorUid,operatedAt);
            break;
        case ServingServiceEventTypeEnum.JumpTo:
            await serviceService.updateServiceCompletedSeconds(guid,operatorUid,serviceEventJson.to,operatedAt);
        

    }
}
async function handleAppointmentInfoEvent(serviceEventJson){
    let operatedAt = new Date(serviceEventJson.operatedAt);
    let serviceGuid = serviceEventJson.serviceGuid;
    let operatorUid = serviceEventJson.operatorUid;
    switch(AppointmentEventTypeEnum[serviceEventJson.event]){
        case AppointmentEventTypeEnum.Setup:
            logger.info(`[handler] appointment setup.`, {structuredData: true});
            let appointmentStartAt = serviceEventJson.appointmentStartAt;
            if (typeof appointmentStartAt == "string"){
                appointmentStartAt = new Date(appointmentStartAt);

            }
            await serviceService.setupService(serviceGuid, operatorUid,appointmentStartAt,serviceEventJson.totalServiceMinutes, operatedAt);
            break;
        case AppointmentEventTypeEnum.UpdateAppointmentStartAt:
            logger.info(`[handler] appointment update start at.`, {structuredData: true});
            let startAt = serviceEventJson.to;
            if (typeof startAt == "string"){
                startAt = new Date(startAt);
            }
            await serviceService.updateServiceAppointmentStartAt(serviceGuid, operatorUid,startAt, operatedAt,);
            break;
        case AppointmentEventTypeEnum.UpdateTotalServiceMinutes:
            logger.info(`[handler] appointment update total service minutes.`, {structuredData: true});
            await serviceService.updateServiceTotalMinutes(serviceGuid, operatorUid,serviceEventJson.to, operatedAt,);
            break;
        case AppointmentEventTypeEnum.Replace:
            logger.info(`[handler] appointment replace.`, {structuredData: true});
            await serviceService.replaceService(serviceGuid,operatorUid,serviceEventJson.replacedByServiceGuid,serviceEventJson.completedSeconds,operatedAt);
            break
}

}
async function setupServiceFromOrder(serviceGuid, operatorUid, operatedAt){
    var service = await serviceService.getService(serviceGuid);
    if (service == null){
        logger.error(`[handler] service not found.`, {structuredData: true});
        return null;
    }
    if (service.appointmentStartAt !=null && service.totalServiceMinutes != null){
        logger.error(`[handler] service already setup.`, {structuredData: true});
        return null;
    }

    var order = await orderService.getActivatedOrder(service.orderGuid);
    if (order == null) {
        logger.warn(`[handler] order not found.`, {structuredData: true});
        return null;
    }

    logger.debug(`[handler] order found setupServiceFromOrder.`, {structuredData: true});
    await serviceEventService.addServiceSetupEvent(serviceGuid,operatorUid,new Date(order.appointmentStartAt),order.totalMinutes,operatedAt)
}

module.exports = {
    serviceAssign,
    serviceAppointment,
    serviceServing,
    serviceOthersEvent,
    whenServiceEventAdded
};