const {logger} = require('../logger/firebase.logger');
const {OnlineInfoCollections,arrayUnion,arrayRemove} = require('../database/firebase.database');

const {MasterStateSketchServiceModel,
    MasterStateSketchDisableModel,
    MasterStateSketchEnum} = require('../models/master_state_sketch.model');

const listAll = async function(uid) {
    let masterStateSketchList = await _listAllData(uid);
    let reuslt = [];
    for (let i = 0; i < masterStateSketchList.length; i++) {
        let masterStateSketchData = masterStateSketchList[i];
        if (masterStateSketchData.type == MasterStateSketchEnum.Service.toString()){
            reuslt.push(MasterStateSketchServiceModel.fromJson(masterStateSketchData));
        }else if (masterStateSketchData.type == MasterStateSketchEnum.Disable.toString()){
            reuslt.push(MasterStateSketchDisableModel.fromJson(masterStateSketchData));
        } else {
            logger.warn(`listAll: unknown type: ${masterStateSketchData.type}`);
        }
    }
    logger.info(`listAll: total ${reuslt.length} master state sketch found`);
    return reuslt;
}
const _listAllData = async function(uid){
    logger.debug(`_listAllData by uid: ${uid}`);
    logger.info(`_listAllData: list all master state sketch from OnlineInfoCollections`);
    var documentSnapshot = await _getByUid(uid);
    if (!documentSnapshot.exists) {
        logger.warn(`_listAllData: not found masterUid.`);
        return [];
    }
    let masterStateSketchList = documentSnapshot.data().masterStateSketchList;
    if (masterStateSketchList == null || masterStateSketchList.length == 0) {
        logger.info(`_listAllData: masterStateSketchList is empty.`);
        return [];
    }
    return masterStateSketchList;
}
const length = async function(uid) {
    logger.debug(`length by uid: ${uid}`);
    logger.info(`length: list all master state sketch from OnlineInfoCollections`);
    var documentSnapshot = await _getByUid(uid);
    if (!documentSnapshot.exists) {
        logger.warn(`length: not found masterUid.`);
        return 0;
    }
    let masterStateSketchList = documentSnapshot.data().masterStateSketchList;
    if (masterStateSketchList == null || masterStateSketchList.length == 0) {
        logger.info(`length: masterStateSketchList is empty.`);
        return 0;
    }
    logger.info(`length: total ${masterStateSketchList.length} master state sketch found`);
    return masterStateSketchList.length;
}

const add = async function(uid, newMasterStateSketch){
    const documentReference = await _getDocumentReference(uid);
    await documentReference.update({
        masterStateSketchList: arrayUnion(newMasterStateSketch.toJson())
    })
}

async function _getDocumentReference(uid){
    return await OnlineInfoCollections.doc(uid);
}
async function _getByUid(uid){
    return await OnlineInfoCollections.doc(uid).get();
}

module.exports = {
    listAll,
    length,
    add
}