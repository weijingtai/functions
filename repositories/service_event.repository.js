const {logger} = require('../logger/firebase.logger');
const {ServiceCollection, DeleteValue} = require('../database/firebase.database');

function getServiceEventsRef(serviceGuid){
    return ServiceCollection.doc(serviceGuid).collection("events");
}
const getServiceEvents = async (serviceGuid)=>{
    logger.info(`[service] get service events`, {structuredData: true});
    logger.debug(`[service] get service events by service guid: ${serviceGuid}`, {structuredData: true});
    return await getServiceEventsRef(serviceGuid).get()
}
const addServiceEvent = async (event)=>{
    logger.info(`[service] add service event: ${event.event}`, {structuredData: true});

    logger.debug(`[service] add service event: ${event.toJson()}`, {structuredData: true});
    await getServiceEventsRef(event.serviceGuid).doc(event.guid).set(event.toJson());
}

module.exports = {
    getEvents:getServiceEvents,
    addEvent:addServiceEvent
}