const {logger} = require('../logger/firebase.logger');
const {OnlineMastersCollection,arrayUnion,arrayRemove,DeleteValue} = require('../database/firebase.database');

const {MasterStateSketchUnavailableModel,MasterStateSketchServingModel,MasterStateSketchAppointmentModel,MasterStateSketchEnum} = require('../models/master_state_sketch.model');




const APPOINTMENT_STATE_SKETCH_KEY = 'appointments'
const SERVING_STATE_SKETCH_KEY = 'serving';
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
const getAppointmentStateSketchByMasterUidAndServiceGuid = async (uid, serviceGuid)=>{
    logger.info(`[repository] get: master state sketch by uid: ${uid} guid: ${serviceGuid}`);
    let onlineInfo = await _getByUid(uid);
    if (!onlineInfo.exists) {
        logger.warn(`[repository] get: not found masterUid.`);
        return null;
    }
    let appointments = onlineInfo.data()[APPOINTMENT_STATE_SKETCH_KEY];
    if (appointments == null || appointments.length == 0) {
        logger.info(`[repository] get: appointments is empty.`);
        return null;
    }
    // filter out serviceUid is serviceGuid
    let appointmentData = appointments.filter(appointment=>appointment.serviceUid == serviceGuid);
    logger.debug(`[repository] get: appointmentData: ${JSON.stringify(appointmentData)}`);
    if (appointmentData == null) {
        logger.warn(`[repository] get: appointmentData is empty.`);
        return null;
    }
    if (appointmentData.length == 0) {
        logger.warn(`[repository] get: appointmentData is empty.`);
        return null;
    }
    if (appointmentData.length > 1) {
        logger.warn(`[repository] get: appointmentData.length > 1`);
        return null;
    }
    // convert to MasterStateSketchAppointmentModel
    return MasterStateSketchAppointmentModel.fromJson(appointmentData[0]);

}
const updateAppointmentStateSketch = async (uid, newAppointmentStateSketch)=>{

    // get online info ref by uid
    let onlineInfoRef = await _getDocumentReference(uid);
    let onlineInfo = await onlineInfoRef.get();
    if (!onlineInfo.exists) {
        logger.warn(`[repository] updateAppointmentStateSketch: not found masterUid.`);
        return null;
    }
    let appointments = onlineInfo.data()[APPOINTMENT_STATE_SKETCH_KEY];
    if (appointments == null || appointments.length == 0) {
        logger.info(`[repository] updateAppointmentStateSketch: appointments is empty.`);
        return null;
    }
    // filter out serviceUid is serviceGuid
    let oldAppointments = appointments.filter(appointment=>appointment.serviceUid != newAppointmentStateSketch.serviceUid);
    if (oldAppointments == null) {
        oldAppointments = [];
    }
    logger.debug(`[repository] updateAppointmentStateSketch: new: ${JSON.stringify(newAppointmentStateSketch.toJson())}`);
    oldAppointments.push(newAppointmentStateSketch.toJson());
    // update appointment state sketch
    await onlineInfoRef.update({
        [APPOINTMENT_STATE_SKETCH_KEY]: oldAppointments
    });
    return newAppointmentStateSketch;

};

const setupServing = async (uid, newServingStateSketch)=>{
    let onlineMasterRef = await _getDocumentReference(uid)
    let onlineMasterDocSnap = await onlineMasterRef.get();
    if (!onlineMasterDocSnap.exists) {
        logger.warn(`[repository] setupServing: not found masterUid.`);
        return null;
    }
    let onlineMaster = onlineMasterDocSnap.data();
    let serving = onlineMaster.serving;
    let appointments = onlineMaster.appointments;
    let updatedAppointments = [];
    let updatedServing = null;
    if (serving == null) {
        logger.debug(`[repository] setupServing: serving is null`);
        if (!_checkAppointmentInAppointments(appointments, newServingStateSketch)){
            logger.warn(`[repository] setupServing: appointments not contains sketch wiht ${newServingStateSketch.serviceUid}`);
            return null
        }
        // remove appointment with service.guid 
        logger.debug(`[repository] setupServing: remove appointment with serviceUid ${newServingStateSketch.serviceUid}`);
        updatedAppointments = _removeAppointmentInAppointments(appointments, newServingStateSketch);
        logger.debug(`[repository] setupServing: updatedAppointments: ${updatedAppointments}`);
        updatedServing = newServingStateSketch.toJson();
        // update onlineMaster
        await onlineMasterRef.update({
            // [APPOINTMENT_STATE_SKETCH_KEY]: updatedAppointments ==null || updatedAppointments.length == 0 ? FieldValue.delete() : updatedAppointments,
            [APPOINTMENT_STATE_SKETCH_KEY]: updatedAppointments ==null? DeleteValue() : updatedAppointments,
            [SERVING_STATE_SKETCH_KEY]: updatedServing
        });
        // logger.debug(`[repository] setupServing: updatedAppointments: ${JSON.stringify(updatedAppointments)}, serving: ${JSON.stringify(updatedServing`);
        return updatedServing;
    }
    serving = MasterStateSketchServingModel.fromJson(serving);
    logger.debug(`[repository] setupServing: serving is not null`);
    // check serving.serviceUid == newServingStateSketch.serviceUid
    if (serving.serviceUid == newServingStateSketch.serviceUid) {
        logger.warn(`[repository] setupServing: serving duplicate setup with :${JSON.stringify(newServingStateSketch.toJson())}`);
        return null
    }
    // check that serving is not complete
    logger.debug(`[repository] setupServing: there is another serving:${JSON.stringify(serving.toJson())}`);
    
    if (serving.canceledAt != null){
        logger.debug(`[repository] setupServing: current serving is canceled`);
    }else{
        logger.debug(`[repository] setupServing: current serving is not canceled`);
        // check endAt 
        if (serving.endAt != null){
            logger.debug(`[repository] setupServing: current serving has endAt`);
            if (serving.endAt.getTime() < new Date().getTime()){
                logger.debug(`[repository] setupServing: current serving is finished`);
            }else{
                logger.debug(`[repository] setupServing: current serving is not finished`);
                return null;
            }
        } else {
            logger.debug(`[repository] setupServing: current serving has not endAt, check completedSeconds`);
            if (serving.completedSeconds >= (servingg.serviceDurationMinutes * 60)){
                logger.debug(`[repository] setupServing: current serving is finished`);
            }else{
                logger.debug(`[repository] setupServing: current serving is not finished, and may is paused`);
                return null;
            }
        }
    }


    // check current servingStateSketch is in appointments
    if (!_checkAppointmentInAppointments(appointments, newServingStateSketch)){
        logger.warn(`[repository] setupServing: appointments not contains sketch wiht ${newServingStateSketch.serviceUid}`);
        return null
    }
    // remove appointment with service.guid
    logger.debug(`[repository] setupServing: remove appointment with serviceUid ${newServingStateSketch.serviceUid}`);
    updatedAppointments = _removeAppointmentInAppointments(appointments, newServingStateSketch);
    logger.debug(`[repository] setupServing: updatedAppointments: ${JSON.stringify(updatedAppointments)}`);
    updatedServing = newServingStateSketch.toJson();
    // update onlineMaster
    await onlineMasterRef.update({
        // [APPOINTMENT_STATE_SKETCH_KEY]: updatedAppointments ==null || updatedAppointments.length == 0 ? FieldValue.delete() : updatedAppointments,
        [APPOINTMENT_STATE_SKETCH_KEY]: updatedAppointments ==null? DeleteValue() : updatedAppointments,
        [SERVING_STATE_SKETCH_KEY]: updatedServing
    });
    return updatedServing
}

const getServing = async function(uid,serviceUid){
    const docSnap = await _getByUid(uid);
    if (!docSnap.exists) {
        logger.warn(`[repository] getServing: not found masterUid.`);
        return null;
    }
    let onlineMaster = docSnap.data();
    let serving = onlineMaster.serving;
    if (serving == null){
        logger.debug(`[repository] getServing: serving is null`);
        return null;
    }
    // check is same serviceUid
    if (serving.serviceUid != serviceUid){
        logger.debug(`[repository] getServing: serving is not same serviceUid`);
        return null;
    }
    logger.debug(`[repository] getServing: update serving success.`);
    return MasterStateSketchServingModel.fromJson(serving);
}
const updateServing = async function(uid, newServingStateSketch){
    // get onlineMaster ref
    const onlineMasterRef = await _getDocumentReference(uid);
    // get onlineMaster
    let docSnap = await onlineMasterRef.get();
    if (!docSnap.exists) {
        logger.warn(`[repository] updateServing: not found masterUid.`);
        return null;
    }
    let onlineMaster = docSnap.data();
    let serving = onlineMaster.serving;
    if (serving == null){
        logger.debug(`[repository] updateServing: serving is null`);
        return null;
    }
    logger.debug(`[repository] updateServing: serving is not null`);
    serving = MasterStateSketchServingModel.fromJson(serving);
    // check serving.serviceUid == newServingStateSketch.serviceUid
    if (serving.serviceUid != newServingStateSketch.serviceUid) {
        logger.warn(`[repository] updateServing: serving not match with :${JSON.stringify(newServingStateSketch.toJson())}`);
        return null
    }
    // compare two serving lastModifiedAt
    let updatedJSON = newServingStateSketch.toJson();
    // set value to firebase.DeleteValue when value is null
    for (let key in updatedJSON){
        if (updatedJSON[key] == null){
            updatedJSON[key] = DeleteValue();
        }
    }
    // compare two serving lastModifiedAt
    // when oldServing's lastModifiedAt is null, it's means current serving never be updated before, update directly
    if (serving.lastModifiedAt == null || serving.lastModifiedAt.getTime() < newServingStateSketch.lastModifiedAt.getTime()){
        await onlineMasterRef.update({
            [SERVING_STATE_SKETCH_KEY]: updatedJSON
        });
        return newServingStateSketch;
    }else{
        logger.warn(`[repository] updateServing: newServingStateSketch lastModifiedAt is not newer than oldServingStateSketch`);
        return null;
    }

}
function _removeAppointmentInAppointments(appointments, appointmentStateSketch){
    if (appointments == null || appointments.length == 0){
        return null;
    }
    let updatedAppointments = appointments.filter(a=>a.serviceUid != appointmentStateSketch.serviceUid);
    return updatedAppointments.length == 0 ? null : updatedAppointments;
}
function _checkAppointmentInAppointments(appointments, appointmentStateSketch){
    if (appointments == null || appointments.length == 0){
        return false;
    }
    return appointments.some((a)=>a.serviceUid == appointmentStateSketch.serviceUid)
}
const add = async function(uid, newMasterStateSketch){
    const documentReference = await _getDocumentReference(uid);
    // check guid is not exists
    let docSnap = await documentReference.get();
    if (!docSnap.exists) {
        logger.warn(`[repository] add: not found masterUid.`);
        return null;
    }
    // check newMasterStateSketch.serviceUid is not exists
    let appointments = docSnap.data()[APPOINTMENT_STATE_SKETCH_KEY];
    if (appointments != null && appointments.length > 0) {
        // get all serviceUid in stateSketches service
        for (let stateSketche of appointments.values()){
            if (stateSketche.serviceUid == newMasterStateSketch.serviceUid){
                logger.warn(`[repository] add: serviceUid is exists.`);
                return null;
            }
        }
    }else{
        // create new array
        appointments = [];
    }
    // add newMasterStateSketch
    appointments.push(newMasterStateSketch.toJson());
    let updatedFields = {
        // [APPOINTMENT_STATE_SKETCH_KEY] : [newMasterStateSketch.toJson()]
        [APPOINTMENT_STATE_SKETCH_KEY] : appointments
    }
    logger.debug(`[repository] add: add master state sketch by uid: ${uid} guid: ${newMasterStateSketch.guid} updatedFields: ${newMasterStateSketch.toJson()}`);
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
        [key]: [updatedMasterStateSketch.toJson()]
    })


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

    getAppointmentStateSketchByMasterUidAndServiceGuid,
    updateAppointmentStateSketch,


    getServing,
    setupServing,
    updateServing,
}