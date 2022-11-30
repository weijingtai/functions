const assignRepository = require('../repositories/assign.repository');
const {logger} = require('../logger/firebase.logger');
const { AssignStateEnum } = require('../models/assign.enum');
const AssignEventModel = require('../models/assign_event.model');


const updateAssignToSend = async (assignGuid,sendAt) => {
    logger.info(`[service] update assign to send`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    if (assign.isDeleted){
        logger.info(`[service] assign deleted`, {structuredData: true});
        return false;
    }
    // check assign status
    
    if(![AssignStateEnum.Canceled,AssignStateEnum.Timeout,AssignStateEnum.Preparing].includes(assign.state)){
        logger.info(`[service] assign state is ${assign.state}, can not update to send`, {structuredData: true});
        return false;
    }
    var now = sendAt != null?sendAt:new Date();
    var timeoutAt = new Date(now.getTime() + assign.assignTimeoutSeconds * 1000);
    // update assign to send
    logger.info(`[service] assign state is ${assign.state}, update assign to send`, {structuredData: true});
    await assignRepository.updateAssign(assignGuid,{
        state:AssignStateEnum.Delivering.toString(),
        assignAt:now.toISOString(),
        lastModifiedAt:now.toISOString(),
        timeoutAt: timeoutAt.toISOString(),
        canceledAt: null,
        });
    return true;
}
const updateAssignToCancel = async (assignGuid,canceledAt) => {
    logger.info(`[service] update assign to cancel`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    if (assign.deletedAt != null){
        logger.info(`[service] assign deleted`, {structuredData: true});
        return false;
    }
    // check assign status
    if(![AssignStateEnum.Assigning,AssignStateEnum.Delivering,AssignStateEnum.Timeout,AssignStateEnum.Rejected].includes(assign.state)){
        logger.info(`[service] assign state is ${assign.state}, can not update to cancel`, {structuredData: true});
        return false;
    }
    // update assign to send
    logger.info(`[service] assign state is ${assign.state}, update assign to send`, {structuredData: true});
    var timeAt = (canceledAt!=null)?canceledAt.toISOString():new Date().toISOString();
    await assignRepository.updateAssign(assignGuid,{
        state:AssignStateEnum.Canceled.toString(),
        canceledAt:timeAt,
        lastModifiedAt:timeAt,
        timeoutAt: null,
        assignAt: null,
        deliveredAt: null,
    });
    return true;
}
const updateAssignToDelivered = async (assignGuid,deliveredAt) => {
    logger.info(`[service] update assign to delivered`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    if (assign.isDeleted){
        logger.info(`[service] assign deleted`, {structuredData: true});
        return false;
    }
    // check assign status
    if(![AssignStateEnum.Delivering].includes(assign.state)){
        logger.info(`[service] assign state is ${assign.state}, can not update to delivered`, {structuredData: true});
        return false;
    }
    // update assign to send
    logger.info(`[service] assign state is ${assign.state}, update assign to delivered`, {structuredData: true});
    var timeAt = (deliveredAt!=null)?deliveredAt.toISOString():new Date().toISOString();
    await assignRepository.updateAssign(assignGuid,
        {
            state:AssignStateEnum.Assigning.toString(),
            deliveredAt:timeAt,
            lastModifiedAt:timeAt});
    return true;
}
const updateAssignToReject = async (assignGuid,rejectedAt) => {
    logger.info(`[service] update assign to reject`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    // check assign is deleted
    if (assign.isDeleted){
        logger.info(`[service] assign deleted`, {structuredData: true});
        return false;
    }
    return _updateResponseState(assign,AssignStateEnum.Rejected,rejectedAt);
}
const updateAssignToAccept = async (assignGuid,acceptedAt) => {
    logger.info(`[service] update assign to accept`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    if (assign.isDeleted){
        logger.info(`[service] assign deleted`, {structuredData: true});
        return false;
    }
    // check assign is not expired
    if (assign.timeoutAt == null){
        logger.warn(`[service] assign timeoutAt is null`, {structuredData: true});
        return false;
    }
    if (assign.state == AssignStateEnum.Timeout || 
        assign.timeoutAt.getTime() < new Date().getTime()){
        logger.warn(`[service] assign is timeout`, {structuredData: true});
        return false;
    }
    return _updateResponseState(assign,AssignStateEnum.Accepted,acceptedAt);
}
const _updateResponseState = async (assign,state,timeAt) => {
    // check assign status
    if(![AssignStateEnum.Assigning].includes(assign.state)){
        logger.info(`[service] assign state is ${assign.state}, can not update to accept`, {structuredData: true});
        return false;
    }
    // update assign to send
    logger.info(`[service] assign state is ${assign.state}, update assign to accept`, {structuredData: true});
    var timeAt = (timeAt!=null)?timeAt.toISOString():new Date().toISOString();
    await assignRepository.updateAssign(assign.guid,{
        state:state.toString(),
        respondedAt:timeAt,
        lastModifiedAt:timeAt,
        timeoutAt:null,
    });
    return true;
}
const deleteAssign = async (assignGuid,deletedAt) => {
    logger.info(`[service] delete assign`, {structuredData: true});
    // get assign by guid
    let assign = await assignRepository.getAssign(assignGuid);
    // if assign not found, return null
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    // check assign status
    if (assign.state == AssignStateEnum.Accepted){
        logger.info(`[service] assign state is ${assign.state}, can not delete`, {structuredData: true});
        return false;
    }
    
    // update assign to send
    logger.info(`[service] assign state is ${assign.state}, delete`, {structuredData: true});
    await assignRepository.updateAssign(assignGuid,{deletedAt:deletedAt!=null?deletedAt.toISOString():new Date().toISOString(),state:AssignStateEnum.Deleted.toString()});
    return true;
}
const getAssign = async (guid) => {
    logger.info(`[service] get assign`, {structuredData: true});
    logger.debug(`[service] get assign by guid: ${guid}`, {structuredData: true});
    let assign = await assignRepository.getAssign(guid);
    if (assign == null) {
        logger.info(`[service] assign not found`, {structuredData: true});
        return null;
    }
    logger.info(`[service] assign found`, {structuredData: true});
    logger.debug(`[service] ${assign.toJson()}`, {structuredData: true});
    return assign;

}




module.exports = {
    updateAssignToSend,
    getAssign,
    deleteAssign,
    updateAssignToCancel,
    updateAssignToDelivered,
    updateAssignToReject,
    updateAssignToAccept
}
