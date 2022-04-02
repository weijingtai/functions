
const functions = require('firebase-functions');
const admin = require("../database/firebase.database")();

async function sendOrderAssign(device,package){
    functions.logger.debug(`sendOrderAssign: ${JSON.stringify(device)}`);
    var androidNotificationToken = [];
    for (var i of device.tokenList){
      if (i.type == "fcm"){
        androidNotificationToken.push(i.token);
      }
    }
    functions.logger.debug(`sendOrderAssign: total:${androidNotificationToken.length} device will be sent to.`);
    return await doSend(androidNotificationToken,'high',package);
}
var doSend =async function(tokenList,priority,package){
//   let options = {
    // priority: 'high',
    // contentAvailable:true
//   }
//   let fcmNotificationData = {}
//   fcmNotificationData = Object.assign(fcmNotificationData,notificationData.alert)
//   fcmNotificationData = Object.assign(fcmNotificationData,notificationData.data)

  var strValueObj = {}
  var notificationObj = Object.assign({},package.alert)
  notificationObj["notification_priority"] = "PRIORITY_MAX";
  notificationObj["default_vibrate_timings"] = false;
  notificationObj["default_light_settings"] = true;
  notificationObj["vibrate_timings"] = ["0.1s","0.2s","0.1s","0.2s"]
  notificationObj["channel_id"] = "high_importance_channel"
  notificationObj["visibility"] = "PUBLIC"
  notificationObj["light_settings"] = {
    "color": {
        "alpha": 0,
        "red": 1,
        "green": 1,
        "blue": 0.1
    },
    "light_on_duration":"3.0s",
    "light_off_duration":"3.0s",
  }
  for (var [k,v] of Object.entries(package.data)){
    if (!isNaN(v)){
      strValueObj[k] = `${v}`
    }else{
      strValueObj[k] = v
    }
  }
  // var notificationAlert = JSON.parse(JSON.stringify(package.alert));
  // delete notificationAlert.sound
  functions.logger.debug(`send notification with alert:${JSON.stringify(package.alert)}`)
  let  message = {
      token:tokenList[0],
      // notification:notificationAlert,
      data:strValueObj,
      android:{
        priority:priority,
        ttl:60000,
        notification:notificationObj,
        // "default_sound": true,
        // visibility: "public"
      }
    }

  functions.logger.debug(`doSend: ${JSON.stringify(message)}`)
  return admin.messaging().send(message)
}



module.exports = {
    sendOrderAssign:sendOrderAssign,
    doSend:doSend
}