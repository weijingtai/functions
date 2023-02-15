
const {MasterRestCollection} = require('../database/firebase.database')
const {logger} = require('../logger/firebase.logger');

const _getTemporayEventRef = async (masterUid,restGuid,eventGuid) =>{
    return await MasterRestCollection.doc(masterUid).collection("temporary").doc(restGuid).collection("events").doc(eventGuid)
}

const add = async (masterUid,event)=>{
    logger.info(`[repository] add event for master:${masterUid} with event:${event.guid}`,{structuredData:true})
    let ref = await _getTemporayEventRef(masterUid,event.unavailableGuid,event.guid)
    // check ref is not exist
    // if it's exists should throw error
    let existsEvent = await ref.get()
    if(existsEvent.exists){
        logger.warn(`[repository] event is exists`,{structuredData:true})
        throw new Error("event is exists")
    }
    // add event
    logger.info(`[repository] add event`,{structuredData:true})
    logger.debug(`[repository] add event: ${JSON.stringify(event)}`,{structuredData:true})
    await ref.set(event.toJson())
    logger.info(`[repository] event added success`,{structuredData:true})
    return event
}

module.exports = {
    add
}
