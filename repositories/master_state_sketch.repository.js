const {logger} = require('../logger/firebase.logger');
const {OnlineInfoCollections,arrayUnion,arrayRemove,DeleteValue} = require('../database/firebase.database');

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
    // let masterStateSketchList = documentSnapshot.data().masterStateSketchList;
    
    let masterStateSketchList =Object.values(documentSnapshot.data().masterStateSketchList);
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
    // let masterStateSketchList = documentSnapshot.data().masterStateSketchList;
    let masterStateSketchList = Object.values(documentSnapshot.data().masterStateSketchList);
    if (masterStateSketchList == null || masterStateSketchList.length == 0) {
        logger.info(`length: masterStateSketchList is empty.`);
        return 0;
    }
    logger.info(`length: total ${masterStateSketchList.length} master state sketch found`);
    return masterStateSketchList.length;
}

const add = async function(uid, newMasterStateSketch){
    const documentReference = await _getDocumentReference(uid);
    // await documentReference.update({
    //     masterStateSketchList: arrayUnion(newMasterStateSketch.toJson())
    // })
    let key = `masterStateSketchList.${newMasterStateSketch.guid}`;
    let updatedFields = {
        [key]: newMasterStateSketch.toJson()
    }
    await documentReference.update(updatedFields)
    return newMasterStateSketch;
}
const update = async function(uid,guid, updatedFields){
    logger.info(`update: update master state sketch by uid: ${uid} guid: ${guid}`);
    logger.debug(`update: updatedFields: ${JSON.stringify(updatedFields)}`);
    let documentReference = await _getDocumentReference(uid);
    let onlineInfoData = await documentReference.get();
    logger.debug(`update: onlineInfoData: ${JSON.stringify(onlineInfoData.data())}`);

    if (!onlineInfoData.exists) {
        logger.warn(`update: not found masterUid.`);
        return;
    }
    let onlineInfo = onlineInfoData.data();
    if (onlineInfo.masterStateSketchList == null || onlineInfo.masterStateSketchList.length == 0) {
        logger.warn(`update: masterStateSketchList is empty.`);
        return;
    }
    // find the master state sketch by guid
    let masterStateSketchList = onlineInfo.masterStateSketchList;
    let key = `masterStateSketchList.${guid}`;
    let masterStateSketch = masterStateSketchList[guid];
    logger.debug(`update: masterStateSketch: ${JSON.stringify(masterStateSketch)}`);
    // for (let i = 0; i < masterStateSketchList.length; i++) {
    //     if (masterStateSketchList[i].guid == guid) {
    //         masterStateSketch = masterStateSketchList[i];
    //         break;
    //     }
    // }
    if (masterStateSketch == null) {
        logger.warn(`update: not found master state sketch by guid: ${guid}`);
        return;
    }
    // when updatedFields contains "appointmentStartAt"
    // add "previousAppointmentStartAt" to the updatedFields
    if (updatedFields.appointmentStartAt != null) {
        updatedFields.previousAppointmentStartAt = masterStateSketch.appointmentStartAt;
    }
    // when updatedFields contains "totalServiceMinutes"
    // add "previousTotalServiceMinutes" to the updatedFields
    if (updatedFields.totalServiceMinutes != null) {
        updatedFields.previousTotalServiceMinutes = masterStateSketch.totalServiceMinutes;
    }

    // check the updated fields is not equals to the original fields
    let isUpdated = false;
    for (let key in updatedFields) {
        if (masterStateSketch[key] != updatedFields[key]) {
            isUpdated = true;
            break;
        }
    }
    if (!isUpdated) {
        logger.info(`update: no fields need to be updated`);
        return;
    }


    let updatedMasterStateSketch = Object.assign(masterStateSketch, updatedFields);
    // remove old master state sketch from masterStateSketchList
    await documentReference.update({
        [key]: updatedMasterStateSketch
    })


    if (updatedMasterStateSketch.type == MasterStateSketchEnum.Service.toString()){
        return MasterStateSketchServiceModel.fromJson(updatedMasterStateSketch);
    } else if (updatedMasterStateSketch.type == MasterStateSketchEnum.Disable.toString()){
        return  MasterStateSketchDisableModel.fromJson(updatedMasterStateSketch);
    } else {
        logger.warn(`update: unknown type: ${masterStateSketch.type}`);
        return null;
    }


    // update the master state sketch
    return updatedMasterStateSketch;

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
    if (onlineInfo.masterStateSketchList == null || onlineInfo.masterStateSketchList.length == 0) {
        logger.warn(`remove: masterStateSketchList is empty.`);
        return;
    }
    // find the master state sketch by guid
    let masterStateSketchList = onlineInfo.masterStateSketchList;
    let key = `masterStateSketchList.${guid}`;
    let masterStateSketch = masterStateSketchList[guid];
    if (masterStateSketch == null) {
        logger.warn(`remove: not found master state sketch by guid: ${guid}`);
        return;
    }

    // remove old master state sketch from masterStateSketchList
    await documentReference.update({
        [key]: DeleteValue()
    })
    // and insert new master state sketch to masterStateSketchList


    if (masterStateSketch.type == MasterStateSketchEnum.Service.toString()){
        return MasterStateSketchServiceModel.fromJson(masterStateSketch);
    } else if (masterStateSketch.type == MasterStateSketchEnum.Disable.toString()){
        return  MasterStateSketchDisableModel.fromJson(masterStateSketch);
    } else {
        logger.warn(`update: unknown type: ${masterStateSketch.type}`);
        return null;
    }
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
    add,
    update,
    remove,
}