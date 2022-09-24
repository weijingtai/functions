
const functions = require('firebase-functions');
const {getAdmin} = require("../firebase.admin");
const admin = getAdmin();
const messaging = admin.messaging()
const fs = require('fs');
const http2 = require('http2');
const apnsAddress = 'https://api.sandbox.push.apple.com'
const basePath = '/3/device/'
const apnsBaseHeader = {
  ':method': 'POST',
	'apns-topic': 'com.wjthub.flutter.massage.host', //you application bundle ID
	':scheme': 'https',
	'apns-push-type': 'alert', // voip, alert
}

const apnsHighPriorityImageHeader = {
    "apns-prority" :10,
    ':method': 'POST',
    'apns-topic': 'com.wjthub.flutter.massage.host', //you application bundle ID
    ':scheme': 'https',
    'apns-push-type': 'alert', // voip, alert
}
const apnsClient = http2.connect(apnsAddress, {
    pfx:fs.readFileSync(`${__dirname}/../MassageO2OHost_APNs_Certificates.p12`),
    passphrase: 'wjt19951215'
});

async function sendOrderAssign(device,package){
    functions.logger.debug(`sendOrderAssign: ${JSON.stringify(device)}`);
    var apnsNotificationToken = [];
    for (var i of device.tokenList){
      if (i.type == "apns"){
        apnsNotificationToken.push(i.token);
      }
    }
    functions.logger.debug(`sendOrderAssign: total:${apnsNotificationToken.length} device will be sent to.`);
    return await doSend(apnsNotificationToken,'high',package);
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

  var token = tokenList[0];
    var apnsHeader;
    if (priority == "high"){
      apnsHeader = Object.assign({},apnsHighPriorityImageHeader)
    }else {
      apnsHeader = Object.assign({}, apnsBaseHeader);
    }
    apnsHeader[":path"] = `${basePath}${token}`
    apnsHeader["apns-expiration"] = Math.round(Date.now() / 1000) + 60
    apnsHeader["apns-collapse-id"] = package.data.assignGuid
    // apnsHeader["apns-topic"] = package.data.type

    let reponseBody = ''
    var notify = { 
      "aps" : { 
        // "alert": "ok",
        "alert" : {
          "title":package.alert.title,
          "body":package.alert.body,
        },
        "badge":1,
        "sound":package.alert.sound,
        "category":"MEETING_INVITATION",
        "mutable-content":1,
        "actionIdentifier": package.data.type,
        // "content-available":1, 包含此key时为 “静默推送” priority 只会是5
      },
      // "gcm.content-available":strValueObj,
      // "gcm.notification.title":"test title",
      // "gcm":{
      //   "notification":{
      //     "title":"test title",
      //     "body":"test body",
      //   }
      // },
      // "gcm.data":strValueObj,
      // "data":strValueObj,
      "fcm_options":{
        "image": "https://firebasestorage.googleapis.com/v0/b/wjt-home.appspot.com/o/headProfile%2Fyueshuya.jpg?alt=media&token=458071a9-3079-4cbb-b3c0-4028f5b99e6a"
      },
      // "payload":strValueObj,
    };
    return new Promise(resolve=>{
      let request = apnsClient.request(apnsHeader);
      let result = {};
      let responseBody = ""
      let responseCode = ""
      request.setEncoding('utf8');
      request.on('response', (headers, flags) => {
        functions.logger.info(`apns response header: ${JSON.stringify(headers)}`, {structuredData: true});
          for (const name in headers) {
              if (name.endsWith("status")){
                  result["statusCode"] = headers[name]
                  responseCode = headers[name]
              }else if (name.endsWith("apns-id")){
                  result["apnsID"] = headers[name]
              }
          }
        // functions.logger.info(`${JSON.stringify(flags)}`, {structuredData: true});
      });
      request.on('data', (chunk) => { 
        reponseBody = chunk 
      });
      request.on('end', () => {
          request.close()
          if (responseCode == 200){
              functions.logger.info(`notify apns success with apns-id(${result["apnsID"]})`, {structuredData: true})
              if (responseBody.length > 0 ){
                result["message"] = responseBody
              }
              resolve(result)
          }else{
            functions.logger.error(`ios doSend error:${responseBody}`)
            result["error"] = responseBody
            resolve(result)
          }
      });
      request.write(JSON.stringify(notify))
      request.end();
    });


  // let  message = {
  //     token:tokenList[0],
  //     // notification:notificationAlert,
  //     data:strValueObj,
  //     android:{
  //       priority:priority,
  //       ttl:0,
  //       notification:package.alert
  //       // "default_sound": true,
  //       // visibility: "public"
  //     }
  //   }

  // functions.logger.debug(`doSend: ${JSON.stringify(message)}`)
  // return admin.messaging().send(message)
} 

function apnsClientSend(){
  return new Promise(resolve=>{
  })
}



module.exports = {
    sendOrderAssign:sendOrderAssign,
    doSend:doSend
}