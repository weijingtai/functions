const assignEventRepository = require('../repositories/assign_event.repository');
const {logger} = require('../logger/firebase.logger');
const AssignEventEnum = require('../models/assign.enum').AssignEventEnum;
const AssignEventModel = require('../models/assign_event.model');
const {v4: uuidv4} = require('uuid');

function _generateAssignEvent(assignGuid,uid,event,createdAt) {
    logger.debug(`[service] generate assign event ${assignGuid},${uid},${event},${createdAt}`, {structuredData: true});
    return new AssignEventModel(
        uuidv4(),
        assignGuid,
        uid,
        createdAt==null?new Date():createdAt,
        event
    )
}

const addSendEvent = async (assignGuid,uid) => {
    logger.info(`[service] add send assign events`, {structuredData: true});
    // get assign by guid
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Send);
    await assignEventRepository.addAssignEvent(event);

}
const addCancelEvent = async (assignGuid,uid) => {
    logger.info(`[service] add cancel assign events`, {structuredData: true});
    // get assign by guid
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Cancel);
    await assignEventRepository.addAssignEvent(event);
}
const addReceiveEvent = async (assignGuid,uid) => {
    logger.info(`[service] add received assign events`, {structuredData: true});
    // get assign by guid
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Received);
    await assignEventRepository.addAssignEvent(event);
}
const addRejectEvent = async (assignGuid,uid) => {
    logger.info(`[service] add rejected assign events`, {structuredData: true});
    // get assign by guid
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Reject);
    await assignEventRepository.addAssignEvent(event);
}
const addAcceptEvent = async (assignGuid,uid) => {
    logger.info(`[service] add accepted assign events`, {structuredData: true});
    // get assign by guid
    
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Accept);
    logger.debug(`[service] ${event.event}`, {structuredData: true});
    await assignEventRepository.addAssignEvent(event);
}
const addDeleteEvent = async (assignGuid,uid) => {
    logger.info(`[service] add delete assign events`, {structuredData: true});
    // get assign by guid
    var event = _generateAssignEvent(assignGuid,uid,AssignEventEnum.Delete);
    await assignEventRepository.addAssignEvent(event);
}
/// add init event to assign's event
const addInitAssignEvent = async (assignGuid,creatorUid,createdAt) => {
    logger.info(`[service] add init assign event`, {structuredData: true});
    // generate event
    let initEvent = _generateAssignEvent(assignGuid,creatorUid,AssignEventEnum.Init,createdAt);
    await assignEventRepository.addAssignEvent(initEvent);
}
module.exports = {
    addSendEvent,
    addCancelEvent,
    addReceiveEvent,
    addRejectEvent,
    addAcceptEvent,
    addDeleteEvent,
    addInitAssignEvent
}
