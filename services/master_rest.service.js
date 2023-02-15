const {v4: uuidv4} = require('uuid');

const {logger} = require('../logger/firebase.logger');


// const MasterRestEventRepository = require('../repositories/master_rest_event.repository');
const MasterRestRepository = require('../repositories/master_rest.repository');
const UnavailableEvent = require('../models/unavailable_event.model');
const UnavailableEventEnum = require('../models/unavailable_event.enum');
const Unavailable = require('../models/unavailable.model');
const UnavailableEnum = require('../models/unavailable.enum');


const deleteUnavailable = async (masterUid,event)=>{
    logger.info(`[service] deleteUnavailable`,{structuredData:true})
    logger.debug(`[service] masterUid:${masterUid}, event:${JSON.stringify(event.toJson())}`,{structuredData:true})
    await MasterRestRepository.deleteTemporaryUnavailable(masterUid,event)
    logger.debug(`[service] deleteUnavailable success`,{structuredData:true})
}
const cacnelUnavailable = async (masterUid,event)=>{
    logger.info(`[service] cacnelUnavailable`,{structuredData:true})
    logger.debug(`[service] masterUid:${masterUid}, event:${JSON.stringify(event.toJson())}`,{structuredData:true})
    await MasterRestRepository.cancelTemporaryUnavailable(masterUid,event)
    logger.debug(`[service] cacnelUnavailable success`,{structuredData:true})
}
const updateStartAt = async (masterUid,event)=>{
    logger.info(`[service] updateStartAt`,{structuredData:true})
    logger.debug(`[service] masterUid:${masterUid}, event:${JSON.stringify(event.toJson())}`,{structuredData:true})
    // get current unavailable
    let unavailable = await MasterRestRepository.getTemporaryUnavailable(masterUid,event.unavailableGuid)
    // current unavialeble should not be deleted, canceled and lastmodified should be less than event
    if(unavailable.deletedAt != null || unavailable.canceledAt != null  || unavailable.lastModifiedAt > event.createdAt){
        logger.debug(`[service] unavailable is not temporary or unavailable is already updated`,{structuredData:true})
        return
    }

    logger.debug(`[service] unavailable: update startAt from ${unavailable.startAt} to ${unavailable.endAt}`,{structuredData:true})
    // update unavailable
    // let previousStartAt = unavailable.startAt
    let updatedFileds = {
        'startAt': event.newDateTime,
        'previousStartAt': unavailable.startAt,
        'lastModifiedAt': event.operatedAt,
    }
    
    logger.debug(`[service] updatedFileds: ${JSON.stringify(updatedFileds)}`,{structuredData:true})
    await MasterRestRepository.updateTemporaryUnavailable(masterUid,event.unavailableGuid,updatedFileds)
    logger.debug(`[service] updateStartAt success`,{structuredData:true})
}
const updateEndAt = async (masterUid,event)=>{
    logger.info(`[service] updateEndAt`,{structuredData:true})
    logger.debug(`[service] masterUid:${masterUid}, event:${JSON.stringify(event.toJson())}`,{structuredData:true})
    // get current unavailable
    let unavailable = await MasterRestRepository.getTemporaryUnavailable(masterUid,event.unavailableGuid)
    // current unavialeble should not be deleted, canceled and lastmodified should be less than event
    if(unavailable.deletedAt != null || unavailable.canceledAt != null  || unavailable.lastModifiedAt > event.operatedAt){
        logger.debug(`[service] unavailable is not temporary or unavailable is already updated`,{structuredData:true})
        return
    }
    
    // update unavailable
    let previousEndAt = unavailable.endAt
    let previousAddSubMinutes = unavailable.addSubMinutes
    if (previousAddSubMinutes == null){
        previousAddSubMinutes = []
    }
    let changedMinutes = Math.floor((event.newDateTime.getTime() - previousEndAt.getTime()) / 60000)

    // calculate addSubMinutes
    logger.debug(`[service] unavailable: update endAt from ${previousEndAt} to ${event.newDateTime} changed ${changedMinutes}`,{structuredData:true})
    previousAddSubMinutes.push(changedMinutes)
    let updatedFileds = {
        'endAt': event.newDateTime,
        'addSubMinutes': previousAddSubMinutes,
        'lastModifiedAt': event.operatedAt,
    }

    await MasterRestRepository.updateTemporaryUnavailable(masterUid,event.unavailableGuid,updatedFileds)
    logger.debug(`[service] updateEndAt success`,{structuredData:true})

}


module.exports = {
    deleteUnavailable,
    cacnelUnavailable,
    updateStartAt,
    updateEndAt
}
