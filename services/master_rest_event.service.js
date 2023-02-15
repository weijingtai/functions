const {v4: uuidv4} = require('uuid');

const {logger} = require('../logger/firebase.logger');


const MasterRestEventRepository = require('../repositories/master_rest_event.repository');
const UnavailableEvent = require('../models/unavailable_event.model');
const UnavailableEventEnum = require('../models/unavailable_event.enum');
const Unavailable = require('../models/unavailable.model');
const UnavailableEnum = require('../models/unavailable.enum');


const addCreatedAudit = async (unavailable)=>{
    logger.info(`[service] add created audit for unavailable ${unavailable.guid}`,{structuredData:true})
    // generate event from unavailable
    let event = new UnavailableEvent({
        guid: uuidv4(),
        unavailableGuid:unavailable.guid,
        operatedAt: unavailable.createdAt,
        operatorUid: unavailable.uid,
        eventType: UnavailableEventEnum.created,
    })
    logger.debug(`[service] event: ${JSON.stringify(event)}`,{structuredData:true})
    let res = await MasterRestEventRepository.add(unavailable.uid,event)
    logger.info(`[service] add created audit success`,{structuredData:true})
    return res
}

module.exports = {
    addCreatedAudit
}
