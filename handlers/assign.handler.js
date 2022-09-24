const assignService = require('../services/assign.service');
const assignEventService = require('../services/assign_event.service');
const serviceEventService = require('../services/service_event.service');
const {logger} = require('../logger/firebase.logger');
const { AssignStateEnum } = require('../models/assign.enum');
const AssignModel = require('../models/assign.model');


const getAssign = async (guid) => {
    logger.info(`[handler] get assign`, {structuredData: true});
    var assign = await assignService.getAssign(guid);
    if (assign == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign found`, {structuredData: true});
    return assign;
}
const sendAssign = async (assignGuid) => {
    logger.info(`[handler] update assign`, {structuredData: true});
    logger.debug(`[handler] update assign by guid: ${assignGuid} with new send state.`, {structuredData: true});
    let res = await assignService.updateAssignToSend(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign updated finished.`, {structuredData: true});
    return res;
}
const cancelAssign = async (assignGuid) => {
    logger.info(`[handler] cancel assign`, {structuredData: true});
    logger.debug(`[handler] cancel assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignService.updateAssignToCancel(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign canceled finished.`, {structuredData: true});
    return res;
}
const deleteAssign = async (assignGuid) => {
    logger.info(`[handler] delete assign`, {structuredData: true});
    logger.debug(`[handler] delete assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignService.deleteAssign(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign deleted finished.`, {structuredData: true});
    return res;
}
const deliveredAssign = async (assignGuid) => {
    logger.info(`[handler] delivered assign`, {structuredData: true});
    logger.debug(`[handler] delivered assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignService.updateAssignToDelivered(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign delivered finished.`, {structuredData: true});
    return res;
}
const acceptAssign = async (assignGuid) => {
    logger.info(`[handler] accept assign`, {structuredData: true});
    logger.debug(`[handler] accept assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignService.updateAssignToAccept(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign accepted finished.`, {structuredData: true});
    return res;
}
const rejectAssign = async (assignGuid) => {
    logger.info(`[handler] reject assign`, {structuredData: true});
    logger.debug(`[handler] reject assign by guid: ${assignGuid}`, {structuredData: true});
    let res = await assignService.updateAssignToReject(assignGuid);
    if (res == null){
        logger.info(`[handler] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[handler] assign rejected finished.`, {structuredData: true});
    return res;
}

// trigger when new assign created
const whenAssignCreated =  async (createdAssign) => {
    // convert assign data to assign model
    var createdAssignModel = AssignModel.fromJson(createdAssign);
    logger.info(`[handler] assign created`, {structuredData: true});
    // create add first event of this assign
    // with initial state
    await assignEventService.addInitAssignEvent(createdAssignModel.guid, createdAssignModel.senderUid,createdAssignModel.createdAt);
    logger.info(`[handler] assign created finished.`, {structuredData: true});
}
const whenAssignStateChanged = async (oldAssign, updatedAssign) => {
    logger.info(`[handler] assign state changed`, {structuredData: true});
    logger.debug(`[handler] assign state changed from ${oldAssign.state} to ${updatedAssign.state}`, {structuredData: true});
    var updatedAssignModel = AssignModel.fromJson(updatedAssign);
    let serviceGuid = updatedAssignModel.serviceGuid;
    let assignGuid = updatedAssignModel.guid;
    let operatorUid = updatedAssignModel.senderUid;
    let masterUid = updatedAssignModel.masterUid;
    let operatedAt = updatedAssignModel.lastModifiedAt;
    console.log(`[handler]  ${JSON.stringify(updatedAssignModel.toJson())} to ${updatedAssign.state}`);
    // handle operation by switch-case
    switch(updatedAssignModel.state){
        case AssignStateEnum.Delivering:
            logger.info(`[trigger] assign send`, {structuredData: true});
            await serviceEventService.sendAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt);
            // await assignHandler.sendAssign(updatedAssign.guid);
            break;
        case AssignStateEnum.Assigning:
            logger.info(`[trigger] assign received`, {structuredData: true});
            break;
        case AssignStateEnum.Canceled:
            logger.info(`[trigger] assign cancel`, {structuredData: true});
            await serviceEventService.cancelAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt);
            // await assignHandler.cancelAssign(updatedAssign.guid);
            break;
        case AssignStateEnum.Rejected:
            logger.info(`[trigger] assign reject`, {structuredData: true});
            await serviceEventService.rejectAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt);
            // await assignHandler.rejectAssign(updatedAssign.guid);
            break;
        case AssignStateEnum.Accepted:
            logger.info(`[trigger] assign accept`, {structuredData: true});
            await serviceEventService.acceptAssignServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt);
            // await assignHandler.acceptAssign(updatedAssign.guid);
            break;
        case AssignStateEnum.Deleted:
            logger.info(`[trigger] assign delete`, {structuredData: true});
            await serviceEventService.unselectMasterServiceEvent(serviceGuid,assignGuid, operatorUid,masterUid,updatedAssignModel.deletedAt);
            // await assignHandler.deleteAssign(updatedAssign.guid);
            break;
        case AssignStateEnum.Timeout:
            logger.info(`[trigger] assign timeout`, {structuredData: true});
            // await assignHandler.timeoutAssign(updatedAssign.guid);
            break;
    }
}


module.exports = {
    getAssign,
    sendAssign,
    deleteAssign,
    cancelAssign,
    deliveredAssign,
    acceptAssign,
    rejectAssign,
    whenAssignCreated,
    whenAssignStateChanged
}