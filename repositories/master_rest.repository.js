
const {MasterRestCollection} = require('../database/firebase.database')
const {Unavailable} = require('../models/unavailable.model')
const {logger} = require('../logger/firebase.logger');

const _getTemporayRef = async (masterUid,restGuid) =>{
    return await MasterRestCollection.doc(masterUid).collection("temporary").doc(restGuid)
}

const deleteTemporaryUnavailable = async (masterUid,event) =>{
    let restGuid = event.unavailableGuid;
    
    logger.info(`[repository] deleteTemporaryUnavailable by masterUid:${masterUid}, restGuid:${restGuid}`,{structuredData:true})
    let ref= await _getTemporayRef(masterUid,restGuid)
    // check ref is exits
    let doc = await ref.get()
    if(!doc.exists){
        logger.warn(`[repository] deleteTemporaryUnavailable not found`,{structuredData:true})
        throw new Error(`[repository] deleteTemporaryUnavailable not found`)
    }
    let data = doc.data()
    // check doc is not deleted
    if(data.deletedAt){
        logger.warn(`[repository] deleteTemporaryUnavailable already deleted`,{structuredData:true})
        throw new Error(`[repository] deleteTemporaryUnavailable already deleted`)
    }
    // compare event operatedAt and doc's lastModifiedAt
    if(event.operatedAt < data.lastModifiedAt){
        logger.warn(`[repository] deleteTemporaryUnavailable event.operatedAt < data.lastModifiedAt`,{structuredData:true})
        throw new Error(`[repository] deleteTemporaryUnavailable event.operatedAt < data.lastModifiedAt`)
    }
    let now = new Date().toISOString()
    await ref.update({
        lastModifiedAt: now,
        deletedAt: now
    })
    logger.info(`[repository] deleteTemporaryUnavailable success`,{structuredData:true})
    return
}

const cancelTemporaryUnavailable = async (masterUid,event) =>{
    let restGuid = event.unavailableGuid;
    logger.info(`[repository] cancelTemporaryUnavailable by masterUid:${masterUid}, restGuid:${restGuid}`,{structuredData:true})
    let ref= await _getTemporayRef(masterUid,restGuid)
    // check ref is exits
    let doc = await ref.get()
    if(!doc.exists){
        logger.warn(`[repository] cancelTemporaryUnavailable not found`,{structuredData:true})
        throw new Error(`[repository] cancelTemporaryUnavailable unavailable not found`)
    }
    let data = doc.data()
    // check doc is not deleted
    if(data.deletedAt){
        logger.warn(`[repository] cancelTemporaryUnavailable already deleted`,{structuredData:true})
        throw new Error(`[repository] cancelTemporaryUnavailable already deleted`)
    }
    if (data.canceledAt){
        logger.warn(`[repository] cancelTemporaryUnavailable already canceled`,{structuredData:true})
        throw new Error(`[repository] cancelTemporaryUnavailable already canceled`)
    }
    // compare event operatedAt and doc's lastModifiedAt
    if(event.operatedAt < data.lastModifiedAt){
        logger.warn(`[repository] cancelTemporaryUnavailable event.operatedAt < data.lastModifiedAt`,{structuredData:true})
        throw new Error(`[repository] cancelTemporaryUnavailable event.operatedAt < data.lastModifiedAt`)
    }
    let now = new Date().toISOString()
    await ref.update({
        lastModifiedAt: now,
        canceledAt: now
    })
    logger.info(`[repository] cancelTemporaryUnavailable success`,{structuredData:true})
    return
}
const getTemporaryUnavailable = async (masterUid,restGuid) =>{
    let ref= await _getTemporayRef(masterUid,restGuid)
    // check ref is exits
    let doc = await ref.get()
    if(!doc.exists){
        logger.warn(`[repository] getTemporaryUnavailable not found`,{structuredData:true})
        throw new Error(`[repository] getTemporaryUnavailable unavailable not found`)
    }
    let data = doc.data()
    // check doc is not deleted
    if(data.deletedAt){
        logger.warn(`[repository] getTemporaryUnavailable already deleted`,{structuredData:true})
        throw new Error(`[repository] getTemporaryUnavailable already deleted`)
    }
    return Unavailable.fromJson(data)
}
const updateTemporaryUnavailable = async (masterUid,unavailableGuid,updatedFileds) =>{
    logger.info(`[repository] updateTemporaryUnavailable by masterUid:${masterUid}, unavailableGuid:${unavailableGuid}`,{structuredData:true})
    logger.debug(`[repository] updateTemporaryUnavailable ${JSON.stringify(updatedFileds)}`,{structuredData:true})
    
    // check updatedFileds contains lastModifiedAt
    // if not exist, add it
    if(!updatedFileds.lastModifiedAt){
        updatedFileds.lastModifiedAt = new Date().toISOString()
    }
    
    // foreach value when value is date type should convert to ISOString
    for(let key in updatedFileds){
        if (updatedFileds[key] == null){
            throw new Error("updatedFileds value can not be null")
        } else if(updatedFileds[key] instanceof Date){
            updatedFileds[key] = updatedFileds[key].toISOString()
        } 
    }

    let ref= await _getTemporayRef(masterUid,unavailableGuid)
    // check ref is exits
    let doc = await ref.get()
    if(!doc.exists){
        logger.warn(`[repository] updateTemporaryUnavailable not found`,{structuredData:true})
        throw new Error(`[repository] updateTemporaryUnavailable unavailable not found`)
    }
    let data = doc.data()
    // check doc is not deleted
    if(data.deletedAt){
        logger.warn(`[repository] updateTemporaryUnavailable already deleted`,{structuredData:true})
        throw new Error(`[repository] updateTemporaryUnavailable already deleted`)
    }
    // check doc is not canceled
    if(data.canceledAt){
        logger.warn(`[repository] updateTemporaryUnavailable already canceled`,{structuredData:true})
        throw new Error(`[repository] updateTemporaryUnavailable already canceled`)
    }
    // check updatedFileds is newer than doc's lastModifiedAt
    if(updatedFileds.lastModifiedAt < data.lastModifiedAt){
        logger.warn(`[repository] updateTemporaryUnavailable updatedFileds.lastModifiedAt < data.lastModifiedAt`,{structuredData:true})
        throw new Error(`[repository] updateTemporaryUnavailable updatedFileds.lastModifiedAt < data.lastModifiedAt`)
    }

    // do update 
    await ref.update(updatedFileds)
    logger.info(`[repository] updateTemporaryUnavailable success`,{structuredData:true})
}

module.exports = {
    deleteTemporaryUnavailable,
    cancelTemporaryUnavailable,
    getTemporaryUnavailable,
    updateTemporaryUnavailable
}