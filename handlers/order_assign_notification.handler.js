
const functions = require("firebase-functions");

const OrderAssignNotification = require("../models/OrderAssignNotification");
const OnlineInfoRepository = require("../repositories/OnlineInfo.reposiotry")
const NotificationService = require("../services/send_notification.service");

const NewOrderAssignNotificationAdded = async function(notification){
  functions.logger.info(`receive orderAssignNotification for order:${notification.orderGuid} assign:${notification.assignGuid} to masterUid:${notification.masterUid}`);
  functions.logger.debug(`get master notification token info`);
  var userNotificationBaseInfo = await _getOnlineUserNotificationBaseInfoByUid(notification.masterUid);
  functions.logger.debug(`generate notification package.`);
  var notifyPackage = generateNotificationPackageByOrderAssignNotification(notification);
  functions.logger.debug(`NewOrderAssignNotificationAdded: notification package created.`)
  return await NotificationService.send(userNotificationBaseInfo,notifyPackage)
}
const CancelOrderAssignNotification = async function(cancelNotification){
  functions.logger.debug("CancelOrderAssignNotification", cancelNotification);
  functions.logger.debug("get OnlineUserNotificationInfoByUid",{uid:cancelNotification.masterUid});
  var userNotificationBaseInfo = await _getOnlineUserNotificationBaseInfoByUid(cancelNotification.masterUid);
  functions.logger.debug(`generate notification package by assignGuid.`, {assignGuid:cancelNotification.assignGuid});
  var notifyPackage = generateCancelNotificationPackageByAssignGuid(cancelNotification.assignGuid);
  functions.logger.debug(`CancelOrderAssignNotification: notification package created.`,notifyPackage)
  return await NotificationService.send(userNotificationBaseInfo,notifyPackage)
}

async function _getOnlineUserNotificationBaseInfoByUid(uid) {
  return OnlineInfoRepository.getUserNotificationBaseInfoByUid(uid)
}
function generateCancelNotificationPackageByAssignGuid(assignGuid){
  return {data:{
    notificationType: "assign/cancel",
    canceledAssignGuid: assignGuid,
  }}
}
function generateNotificationPackageByOrderAssignNotification(orderAssignNotification){
  var host = orderAssignNotification.hostBaseInfo;
  functions.logger.debug(`generateNotificationPackageByOrderAssignNotification: ${JSON.stringify(host)}`);

  var title =  `${orderEmoji}新的订单 ${host.displayName} 分配给你`;
  var actionUrl = `/order/assign/master?hostUid=${host.uid}&orderGuid=${orderAssignNotification.orderGuid}&serviceGuid=${orderAssignNotification.serviceGuid}&assignGuid=${orderAssignNotification.assignGuid}`
  // var title = `${orderEmoji} ${host.displayName} 分配给你一个新的订单，请查看`;
  var body = `${orderAssignNotification.totalServiceMinutes}min ${notificationInfo.alertBody}`
  var res = {
    "alert":{
      "sound" : notificationInfo.alertSound,
      "title":title,
      "body": body,
      "image": host.photoURL,
    },
    data:{
      "notificationType": "assign",
      "title": title,
      "body": body,
      "senderURL": host.photoURL,
      "senderUid": host.uid,
      "senderDisplayName": host.displayName,
      "orderGuid":orderAssignNotification.orderGuid,
      "serviceGuid":orderAssignNotification.serviceGuid,
      "assignState":orderAssignNotification.assignState,
      "totalServiceNumber":orderAssignNotification.totalServiceNumber,
      "assignGuid":orderAssignNotification.assignGuid,
      "assignTimeoutSeconds":orderAssignNotification.assignTimeoutSeconds,
      "orderStatus":orderAssignNotification.orderStatus,
      "assignAt":orderAssignNotification.assignAt,
      "totalServiceMinutes":orderAssignNotification.totalServiceMinutes,
      "action": actionUrl,
    },
    ttl: `${notificationInfo.assignTimeoutSeconds}s`,
      // "orderCreatedAt":orderAssignNotification.orderCreatedAt,
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
    CancelOrderAssignNotification:CancelOrderAssignNotification
    // getMasterNotificationInfo:getMasterNotificationInfo
}