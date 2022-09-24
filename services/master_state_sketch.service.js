const {logger} = require('../logger/firebase.logger');

const MasterStateSketchRepository = require('../repositories/master_state_sketch.repository');

const listAll = async function(uid) {
    let masterStateSketchList = await MasterStateSketchRepository.listAll(uid);
    let reuslt = [];
    logger.info(`listAll: total ${reuslt.length} master state sketch found`);
    return masterStateSketchList;
}
const length = async function(uid) {
    logger.info(`length: total ${masterStateSketchList.length} master state sketch found`);
    return await MasterStateSketchRepository.length(uid);
}

const add = async function(uid, newMasterStateSketch){
    await MasterStateSketchRepository.add(uid, newMasterStateSketch);

}

module.exports = {
    listAll,
    length,
    add
}