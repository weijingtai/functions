const {OnlineMastersCollection} = require('../database/firebase.database');
const logger = require("firebase-functions").logger;


const get= async function(uid){
    logger.info(`[repository] get masterOnlineInfo by masterUid:${uid} from OnlineMastersCollection`);
    var onlineMasterDocSnap = await _getDocumentReference(uid).get();
    if (!onlineMasterDocSnap.exists){
        logger.info(`[repository] get masterOnlineInfo by masterUid:${uid} done, not found.`);
        return null;
    }
    var onlineMasterInfoData = onlineMasterDocSnap.data();
    logger.info(`[repository] get masterOnlineInfo by masterUid:${uid} done, found.`);
    logger.debug(`[repository] covert Firestore data to OnlineMaster`);
    var onlineMaster = OnlineMaster.fromJSON(onlineMasterInfoData);
    logger.debug(`${JSON.stringify(onlineMaster.toJSON())}`);
    return onlineMaster;
}
const update= async function(uid,newOnlineMasterInfo){
    logger.info(`[repository] update masterOnlineInfo by masterUid:${uid} to OnlineMastersCollection`);
    // get document reference
    var onlineMasterDocRef = _getDocumentReference(uid);
    var onlineMasterDocSnap = await onlineMasterDocRef.get();
    if (!onlineMasterDocSnap.exists){
        logger.info(`[repository] update masterOnlineInfo by masterUid:${uid} done, not found.`);
        return;
    }
    // get document snapshot data
    var onlineMasterInfoData = onlineMasterDocSnap.data();
    // compare newOnlineMasterInfo with onlineMasterInfoData 
    // only update when newOnlineMasterInfo is different from onlineMasterInfoData
    if (JSON.stringify(newOnlineMasterInfo.toJSON()) != JSON.stringify(onlineMasterInfoData)){
        logger.info(`[repository] update masterOnlineInfo by masterUid:${uid} done, found and updated.`);
        await onlineMasterDocRef.set(newOnlineMasterInfo.toJSON(),{merge:true});
        return newOnlineMasterInfo;
    }else{
        logger.info(`[repository] update masterOnlineInfo by masterUid:${uid} done, found but not updated.`);
        return null;
    }
}
async function _getDocumentReference(uid){
    return OnlineMastersCollection.doc(uid);
}

module.exports = {
    get,
    update,
}