
// const admin = require('firebase-admin');
// const admin = require("../database/firebase.database")();
const {OnlineInfoCollections} = require('../database/firebase.database');
const logger = require("firebase-functions").logger;


const UserNotificationBaseInfo = require("../models/UserNotificationBaseInfo");
const DeviceNotificationToken = require("../models/DeviceNotificationToken");

const getUserNotificationBaseInfoByUid = async function(uid) {
    logger.info(`getUserNotificationBaseInfoByUid: get masterUid:${uid} from OnlineInfoCollections`);
   var notificationInfoSnapshot = await OnlineInfoCollections.doc(uid).get()
   if (!notificationInfoSnapshot.exists){
       throw new Error("MasterUid not found in OnlineInfo.")
   }
   logger.debug(`getUserNotificationBaseInfoByUid: ${notificationInfoSnapshot.data()}`)
   return getDeviceNotificationToken(uid,notificationInfoSnapshot.data())
}
var getDeviceNotificationToken = function(uid,onlineinfoSnaphostData){

    logger.debug(`getDeviceNotificationToken: ${uid}, ${JSON.stringify(onlineinfoSnaphostData)}`);
    var deviceNotificationTokenList = onlineinfoSnaphostData["notifyTokenList"].map(t=>DeviceNotificationToken.fromJson(t));
    logger.debug(`getDeviceNotificationToken: total:${deviceNotificationTokenList.length} notification token.`);

    return new UserNotificationBaseInfo(uid,onlineinfoSnaphostData['deviceType'],deviceNotificationTokenList);
}
const get= async function(uid){
    logger.info(`getOnlineInfo: get masterUid:${uid} from OnlineInfoCollections`);
    var onlineInfo = await OnlineInfoCollections.doc(uid).get();
    if (!onlineInfo.exists){
        logger.info(`getOnlineInfo: masterUid:${uid} not found.`);
        return null;
    }
    logger.info(`getOnlineInfo: get masterUid:${uid} from OnlineInfoCollections success.`);
    return onlineInfo.data();
}
const update= async function(uid,onlineInfo){
    logger.info(`updateOnlineInfo: update masterUid:${uid} from OnlineInfoCollections`);
    var updateResult = await OnlineInfoCollections.doc(uid).set(onlineInfo, { merge: true });
    logger.info(`updateOnlineInfo: update masterUid:${uid} from OnlineInfoCollections success.`);
    return updateResult;


}

module.exports = {
    // OnlineInfoCollections:OnlineInfoCollections,
    // for test only
    getDeviceNotificationToken:getDeviceNotificationToken,
    getUserNotificationBaseInfoByUid:getUserNotificationBaseInfoByUid.apply,
    get,
    update,
}