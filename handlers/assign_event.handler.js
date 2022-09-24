const assignEventService = require('../services/assign_event.service');
const assignService = require('../services/assign.service');
const AssignEventEnum = require('../models/assign.enum').AssignEventEnum;
const {logger} = require('../logger/firebase.logger');

const sendEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] add send event`, {structuredData: true});
    logger.debug(`[handler] add send event to assignGuid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addSendEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign send event added finished.`, {structuredData: true});
    return res;
}
const cancelEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] cancel assign`, {structuredData: true});
    logger.debug(`[handler] cancel assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addCancelEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign canceled finished.`, {structuredData: true});
    return res;
}
const rejectEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] add reject event`, {structuredData: true});
    logger.debug(`[handler] add reject event to assignGuid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addRejectEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign reject event added finished.`, {structuredData: true});
    return res;
}
const acceptEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] add reject event`, {structuredData: true});
    logger.debug(`[handler] add reject event to assignGuid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addAcceptEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign reject event added finished.`, {structuredData: true});
    return res;
}
const receiveEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] add receive event`, {structuredData: true});
    logger.debug(`[handler] add receive event to assignGuid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addReceiveEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign receive event added finished.`, {structuredData: true});
    return res;
}
const deleteEvent = async (assignGuid, operatorUid) => {
    logger.info(`[handler] add receive event`, {structuredData: true});
    logger.debug(`[handler] add receive event to assignGuid: ${assignGuid}`, {structuredData: true});
    let res = await assignEventService.addDeleteEvent(assignGuid, operatorUid);
    logger.info(`[handler] assign receive event added finished.`, {structuredData: true});
    return res;
}
const whenAssignEventAdded = async (assignEvent) => {
    logger.debug(`[handler] event: ${assignEvent.toJson()}`, {structuredData: true});
    let res;
  // handle operation by switch-case
    switch(assignEvent.event){
    case AssignEventEnum.Send:
        logger.info(`[handler] assign send`, {structuredData: true});
        res = await assignService.updateAssignToSend(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    case AssignEventEnum.Received:
        logger.info(`[handler] assign received`, {structuredData: true});
        res = await assignService.updateAssignToDelivered(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    case AssignEventEnum.Cancel:
        logger.info(`[handler] assign cancel`, {structuredData: true});
        res = await assignService.updateAssignToCancel(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    case AssignEventEnum.Reject:
        logger.info(`[handler] assign reject`, {structuredData: true});
        res = await assignService.updateAssignToReject(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    case AssignEventEnum.Accept:
        logger.info(`[handler] assign accept`, {structuredData: true});
        res = await assignService.updateAssignToAccept(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    case AssignEventEnum.Delete:
        logger.info(`[handler] assign delete`, {structuredData: true});
        res = await assignService.deleteAssign(assignEvent.assignGuid, assignEvent.operateAt);
        break;
    }
    return res;
}
module.exports = {
    sendEvent,
    cancelEvent,
    rejectEvent,
    acceptEvent,
    receiveEvent,
    deleteEvent,
    whenAssignEventAdded,
}