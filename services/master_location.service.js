
const {logger} = require('../logger/firebase.logger');
const OnlineMasterRepository = require('../repositories/online_master.repository');
const update = async (uid,location) => {
    logger.info(`[service] updateLocationInfo: uid=${uid}`);
    let onlineMaster = await OnlineMasterRepository.get(uid);
    if (onlineMaster == null){
        logger.info(`[service] updateLocationInfo: uid=${uid}, onlineMaster not found`);
        return;
    }
    // compare new location with old location
    // only update when new location is different from old location
    if (JSON.stringify(location) != JSON.stringify(onlineMaster.location)){
        logger.info(`[service] update location`);
        logger.debug(`[service] updateLocationInfo: uid=${uid}, location=${JSON.stringify(location)}`);
        onlineMaster.location = location;
        onlineMaster.lastReportAt = new Date();
        let res = await OnlineMasterRepository.update(uid,onlineMaster);
        if (res == null){
            logger.info(`[service] update location failed.`);
            return null;
        }else{
            logger.info(`[service] update location success.`);
            return onlineMaster;
        }
    }else{
        logger.info(`[service] update is not changed.`);
        return;
    }

}

module.exports = {
    update
}