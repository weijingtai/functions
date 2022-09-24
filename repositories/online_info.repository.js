
// const admin = require('firebase-admin');
const admin = require("../database/firebase.database")();
const OnlineInfoCollections = admin.firestore().collection("OnlineInfo")
const logger = require("firebase-functions").logger;


const UserNotificationBaseInfo = require("../models/UserNotificationBaseInfo");
const DeviceNotificationToken = require("../models/DeviceNotificationToken");

const getUserNotificationBaseInfoByUid = async function(uid) {
    logger.info(`getUserNotificationBaseInfoByUid: get masterUid:${uid} from OnlineInfoCollections`);
    // logger.info(`${admin}`)
    
//    OnlineInfoCollections.doc("WiqoPCGiF4uw7K3m84xSG6gZZpzG").get().then(snap=>{
//     logger.info(`getUserNotificationBaseInfoByUid: ${snap}`);
//    })
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

module.exports = {
    // OnlineInfoCollections:OnlineInfoCollections,
    // for test only
    getDeviceNotificationToken:getDeviceNotificationToken,
    getUserNotificationBaseInfoByUid:getUserNotificationBaseInfoByUid
}