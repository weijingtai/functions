
const functions = require("firebase-functions");

const OrderAssignNotification = require("../models/OrderAssignNotification");
const OnlineInfoRepository = require("../repositories/OnlineInfo.reposiotry")
const NotificationService = require("../services/send_notification.service");

const NewOrderAssignNotificationAdded = async function(notification){
  functions.logger.info(`receive orderAssignNotification for order:${notification.orderGuid} assign:${notification.assignGuid} to masterUid:${notification.masterUid}`);

  functions.logger.debug(`get master notification token info`);
  var userNotificationBaseInfo = await OnlineInfoRepository.getUserNotificationBaseInfoByUid(notification.masterUid);
  functions.logger.debug(`generate notification package.`);
  var notifyPackage = generateNotificationPackageByOrderAssignNotification(notification);
  functions.logger.debug(`NewOrderAssignNotificationAdded: notification package created.`)
  return await NotificationService.send(userNotificationBaseInfo,notifyPackage)
}
function generateNotificationPackageByOrderAssignNotification(orderAssignNotification){
  var host = orderAssignNotification.hostBaseInfo;
  functions.logger.debug(`generateNotificationPackageByOrderAssignNotification: ${JSON.stringify(host)}`);

  var res = {
    "alert":{
      "sound" : notificationInfo.alertSound,
      "title": `${orderEmoji}新的订单 ${host.displayName} `,
      "body": notificationInfo.alertBody,
      "image": host.photoURL,
      // "image": "https://firebasestorage.googleapis.com/v0/b/wjt-home.appspot.com/o/headProfile%2Fkongli_2.jpg?alt=media&token=be3e048f-504f-4308-bf18-8ddd030288c4",

    },
    data:{
      "type": "assign",
      "title": "title",
      "body": "body",
      "senderURL": host.photoURL,
      "senderUid": host.uid,
      "senderDisplayName": host.displayName,
      "orderGuid":orderAssignNotification.orderGuid,
      "serviceGuid":orderAssignNotification.serviceGuid,
      "assignState":orderAssignNotification.assignState,
      "totalServiceNumber":orderAssignNotification.totalServiceNumber,
      "assignGuid":orderAssignNotification.assignGuid,
      "assignTimeoutSeconds":orderAssignNotification.assignTimeoutSeconds,
      "orderState":orderAssignNotification.orderState,
      "orderCreatedAt":orderAssignNotification.orderCreatedAt,
      "assignAt":orderAssignNotification.assignAt,
      "totalServiceMinutes":orderAssignNotification.totalServiceMinutes,
    }
  }
  functions.logger.debug(`generateNotificationPackageByOrderAssignNotification: ${JSON.stringify(res)}`);
  return res
}
const orderEmoji = "🕑"
const notificationInfo = {
  "alertTitle":"你有一个新的订单",
  "alertBody":"新订单",
  "alertSound":"default"
}



module.exports = {
    NewOrderAssignNotificationAdded:NewOrderAssignNotificationAdded,
    // getMasterNotificationInfo:getMasterNotificationInfo
}