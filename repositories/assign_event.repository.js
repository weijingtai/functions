const {logger} = require('../logger/firebase.logger');
const {AssignCollection, DeleteValue} = require('../database/firebase.database');
const AssignModel = require('../models/assign.model');

function getAssignEventsRef(assignGuid){
    return AssignCollection.doc(assignGuid).collection("events");
}
const getAssignEvents = async (assignGuid)=>{
    logger.info(`[service] get assign events`, {structuredData: true});
    logger.debug(`[service] get assign events by assign guid: ${assignGuid}`, {structuredData: true});
    return await getAssignEventsRef(assignGuid).get()
}
const addAssignEvent = async (event)=>{
    logger.info(`[service] add assign event: ${event.event}`, {structuredData: true});

    logger.debug(`[service] add assign event: ${event.toJson()}`, {structuredData: true});
    await getAssignEventsRef(event.assignGuid).doc(event.guid).set(event.toJson());
}

module.exports = {
    getAssignEvents,
    addAssignEvent
}