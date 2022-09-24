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
    await MasterStateSketchService.add(uid, newMasterStateSketch);

}

module.exports = {
    listAll,
    length,
    add
}