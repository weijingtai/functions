
const {logger} = require('../logger/firebase.logger');
const OnlineInfoService = require('../services/master_location.service');

const onLocationChanged = async (masterUid,newPosition) => {
    logger.info(`[handler] onlineMasterLocationChanged: masterUid=${masterUid}`);
    logger.debug(`[handler] onlineMasterLocationChanged: masterUid=${masterUid}, newPosition=${JSON.stringify(newPosition)}`);
    let res = await OnlineInfoService.update(masterUid,newPosition);
    if (res == null){
        logger.info(`[handler] onlineMasterLocationChanged: masterUid=${masterUid}, update failed.`);
    }else{
        logger.info(`[handler] onlineMasterLocationChanged: masterUid=${masterUid}, update success.`);
    }

}
module.exports = {
    onLocationChanged,
}