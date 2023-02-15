
const {v4: uuidv4} = require('uuid');

const {logger} = require('../logger/firebase.logger');


const MasterRestEventService = require('../services/master_rest_event.service');
const MasterRestService = require('../services/master_rest.service');
const MasterStateSketchService = require('../services/master_state_sketch.service');
const UnavailableEvent = require('../models/unavailable_event.model');
const UnavailableEventEnum = require('../models/unavailable_event.enum');
const Unavailable = require('../models/unavailable.model');
const UnavailableEnum = require('../models/unavailable.enum');


const whenUnavailableAdded = async (unavailable)=>{
    logger.info(`[handler] whenUnavailableAdded`,{structuredData:true})
    logger.debug(`[handler] unavailable: ${JSON.stringify(unavailable)}`,{structuredData:true})
    let res = await MasterRestEventService.addCreatedAudit(unavailable)
    await MasterStateSketchService.addUnavailableStateSketch(unavailable)
    logger.info(`[handler] whenUnavailableAdded success`,{structuredData:true})
    return
}



const whenEventAdded = async (masterUid,event)=>{
    logger.info(`[handler] whenEventAdded ${event.eventType}`,{structuredData:true})
    switch(event.eventType){
        case UnavailableEventEnum.created:
            break;
        case UnavailableEventEnum.delete:
            logger.debug(`[handler] event: delete unavailable`,{structuredData:true})
            await MasterRestService.deleteUnavailable(masterUid,event)
            await MasterStateSketchService.cacnelUnavailable(masterUid,event.unavailableGuid,event.operatedAt)
            break;
        case UnavailableEventEnum.cancel:
            logger.debug(`[handler] event: cancel unavailable`,{structuredData:true})
            await MasterRestService.cacnelUnavailable(masterUid,event)
            await MasterStateSketchService.cacnelUnavailable(masterUid,event.unavailableGuid,event.operatedAt)
            break;
        case UnavailableEventEnum.updateStartAt:
            logger.debug(`[handler] event: update unavailable startAt`,{structuredData:true})
            await MasterRestService.updateStartAt(masterUid,event)
            await MasterStateSketchService.updateUnavailableStartAt(masterUid,event.unavailableGuid,event.newDateTime,event.operatedAt)
            break;
        case UnavailableEventEnum.updateEndAt:
            logger.debug(`[handler] event: update unavailable endAt`,{structuredData:true})
            await MasterRestService.updateEndAt(masterUid,event)
            await MasterStateSketchService.updateUnavailableEndAt(masterUid,event.unavailableGuid,event.newDateTime,event.operatedAt)
            break;
    }
}


module.exports = {
    whenUnavailableAdded,
    whenEventAdded
}

