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
const update = async function(uid,guid, updatedFields){
    
    return await MasterStateSketchService.update(uid,guid, updatedFields);
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