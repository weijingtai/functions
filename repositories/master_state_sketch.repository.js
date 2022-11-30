const {logger} = require('../logger/firebase.logger');
const {OnlineMastersCollection,arrayUnion,arrayRemove,DeleteValue} = require('../database/firebase.database');

const {MasterStateSketchUnavailableModel,MasterStateSketchServingModel,MasterStateSketchEnum} = require('../models/master_state_sketch.model');

const listAll = async function(uid) {
    let stateSketches = await _listAllData(uid);
    let reuslt = [];
    for (let i = 0; i < stateSketches.length; i++) {
        let masterStateSketchData = stateSketches[i];
        if (masterStateSketchData.type == MasterStateSketchEnum.Serving.toString()){
            reuslt.push(MasterStateSketchServingModel.fromJson(masterStateSketchData));
        }else if (masterStateSketchData.type == MasterStateSketchEnum.Unavailable.toString()){
            reuslt.push(MasterStateSketchUnavailableModel.fromJson(masterStateSketchData));
        } else {
            logger.warn(`listAll: unknown type: ${masterStateSketchData.type}`);
        }
    }
    logger.info(`listAll: total ${reuslt.length} master state sketch found`);
    return reuslt;
}
const _listAllData = async function(uid){
    logger.debug(`_listAllData by uid: ${uid}`);
    logger.info(`_listAllData: list all master state sketch from OnlineMastersCollection`);
    var documentSnapshot = await _getByUid(uid);
    if (!documentSnapshot.exists) {
        logger.warn(`_listAllData: not found masterUid.`);
        return [];
    }
    // let stateSketches = documentSnapshot.data().stateSketches;
    
    let stateSketches =Object.values(documentSnapshot.data().stateSketches);
    if (stateSketches == null || stateSketches.length == 0) {
        logger.info(`_listAllData: stateSketches is empty.`);
        return [];
    }
    return stateSketches;
}
const length = async function(uid) {
    logger.debug(`length by uid: ${uid}`);
    logger.info(`length: list all master state sketch from OnlineMastersCollection`);
    var documentSnapshot = await _getByUid(uid);
    if (!documentSnapshot.exists) {
        logger.warn(`length: not found masterUid.`);
        return 0;
    }
    // let stateSketches = documentSnapshot.data().stateSketches;
    let stateSketches = Object.values(documentSnapshot.data().stateSketches);
    if (stateSketches == null || stateSketches.length == 0) {
        logger.info(`length: stateSketches is empty.`);
        return 0;
    }
    logger.info(`length: total ${stateSketches.length} master state sketch found`);
    return stateSketches.length;
}

// @return MasterStateSketchServingModel or MasterStateSketchUnavailableModel by "type" field
const get = async function(uid,guid){
    logger.info(`[repository] get: master state sketch by uid: ${uid} guid: ${guid}`);
    let onlineInfo = await _getByUid(uid);
    if (!onlineInfo.exists) {
        logger.warn(`[repository] get: not found masterUid.`);
        return null;
    }
    let stateSketches = onlineInfo.data().stateSketches;
    if (stateSketches == null || stateSketches.length == 0) {
        logger.info(`[repository] get: stateSketches is empty.`);
        return null;
    }
    let masterStateSketchData = stateSketches[guid];
    if (masterStateSketchData == null) {
        logger.info(`[repository] get: masterStateSketchData is empty.`);
        return null;
    }
    if (masterStateSketchData.type == MasterStateSketchEnum.Serving.toString()){
        logger.info(`[repository] get: masterStateSketchData is MasterStateSketchServingModel.`);
        return MasterStateSketchServingModel.fromJson(masterStateSketchData);
    } else if (masterStateSketchData.type == MasterStateSketchEnum.Unavailable.toString()){
        logger.info(`[repository] get: masterStateSketchData is MasterStateSketchServingModel.`);
        return MasterStateSketchUnavailableModel.fromJson(masterStateSketchData);
    }

}

const add = async function(uid, newMasterStateSketch){
    const documentReference = await _getDocumentReference(uid);
    // await documentReference.update({
    //     stateSketches: arrayUnion(newMasterStateSketch.toJson())
    // })
    let key = `stateSketches.${newMasterStateSketch.guid}`;
    let updatedFields = {
        [key]: newMasterStateSketch.toJson()
    }
    await documentReference.update(updatedFields)
    return newMasterStateSketch;
}
const update = async function(uid,updatedMasterStateSketch){
    let guid = updatedMasterStateSketch.guid;
    logger.info(`[repository]update: update master state sketch by uid: ${uid} guid: ${guid}`);
    let documentReference = await _getDocumentReference(uid);

    let key = `stateSketches.${guid}`;

    // remove old master state sketch from stateSketches
    await documentReference.update({
        [key]: updatedMasterStateSketch.toJson()
    })


    // update the master state sketch
    return null;

}


const remove = async function(uid,guid){
    logger.info(`remove: master state sketch by uid: ${uid} guid: ${guid}`);
    let documentReference = await _getDocumentReference(uid);
    let onlineInfoData = await documentReference.get();
    logger.debug(`remove: onlineInfoData: ${JSON.stringify(onlineInfoData.data())}`);

    if (!onlineInfoData.exists) {
        logger.warn(`remove: not found masterUid.`);
        return;
    }
    let onlineInfo = onlineInfoData.data();
    if (onlineInfo.stateSketches == null || onlineInfo.stateSketches.length == 0) {
        logger.warn(`remove: stateSketches is empty.`);
        return;
    }
    // find the master state sketch by guid
    let stateSketches = onlineInfo.stateSketches;
    let key = `stateSketches.${guid}`;
    let masterStateSketch = stateSketches[guid];
    if (masterStateSketch == null) {
        logger.warn(`remove: not found master state sketch by guid: ${guid}`);
        return;
    }

    // remove old master state sketch from stateSketches
    await documentReference.update({
        [key]: DeleteValue()
    })
    // and insert new master state sketch to stateSketches


    if (masterStateSketch.type == MasterStateSketchEnum.Serving.toString()){
        return MasterStateSketchServingModel.fromJson(masterStateSketch);
    } else if (masterStateSketch.type == MasterStateSketchEnum.Unavailable.toString()){
        return  MasterStateSketchUnavailableModel.fromJson(masterStateSketch);
    } else {
        logger.warn(`update: unknown type: ${masterStateSketch.type}`);
        return null;
    }
}
async function _getDocumentReference(uid){
    return await OnlineMastersCollection.doc(uid);
}
async function _getByUid(uid){
    return await OnlineMastersCollection.doc(uid).get();
}

module.exports = {
    listAll,
    length,
    get,
    add,
    update,
    remove,
}