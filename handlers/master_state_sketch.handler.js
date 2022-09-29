const {logger} = require('../logger/firebase.logger');

const MasterStateSketchService = require('../services/master_state_sketch.service');

const listAll = async function(uid) {
    let masterStateSketchList = await MasterStateSketchService.listAll(uid);
    let reuslt = [];
    logger.info(`listAll: total ${reuslt.length} master state sketch found`);
    return masterStateSketchList;
}
const length = async function(uid) {
    logger.info(`length: total ${masterStateSketchList.length} master state sketch found`);
    return await MasterStateSketchService.length(uid);
}

const add = async function(uid, newMasterStateSketch){
    
    return await MasterStateSketchService.add(uid, newMasterStateSketch);
}
//**
// * 
//  * @param {*} uid 
//  * @param {*} guid 
//  * @param {*} updatedFields 
//  * @returns 
//  */
const update = async function(uid,guid, updatedFields){
    logger.info(`[handler] update: uid=${uid}, guid=${guid}, updatedFields=${JSON.stringify(updatedFields)}`);

    // current request is update MasterStateSketchService
    if (updatedFields.endAt != null){
        let newEndAt = updatedFields.endAt;
        if (!(updatedFields.endAt instanceof Date)){
            newEndAt = new Date(updatedFields.endAt);
        } 
        return await MasterStateSketchService.updateDisableStateSketchEndAt(uid,guid, newEndAt);
    } else if (updatedFields.isCanceled != null && updatedFields.isCanceled){
        return await MasterStateSketchService.updateDisableStateSketchToCanceled(uid,guid);
    }
    // key value in updatedFields
    // if value is formatted iso date string, convert it to Date object
    for (let key in updatedFields){
        let value = updatedFields[key];
        // value is formatted iso date string, with regex
        if (value != null && typeof value === 'string' 
        && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)){
            updatedFields[key] = new Date(value);
        }
    }
    
    return await MasterStateSketchService.updateServiceStateSketch(uid,guid, updatedFields);
}
const remove = async function(uid,guid,){
    return await MasterStateSketchService.remove(uid,guid);
}
module.exports = {
    listAll,
    length,
    add,
    update,
    remove
}