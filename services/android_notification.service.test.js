
const androidSender = require("./android_notification.service");

describe("android_notifcication.service",()=>{
  it("test send notification to android device by fcm token.",()=>{
      var pkg = {
    alert:{
      sound : 'default',
      "title": `新的指派 来自 超凡按摩`,
      "body" : "body",
    //   "image": host.photoURL,
    },
    data:{
      "type": "assign",
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
    androidSender.doSend(["fb4OEwPaTNeW10wvP9Jyr3:APA91bHWqnFbw3qw7shrdHr-JTqY6JI1QH1Wlga4J7qc-rc0ZCr2b5cqrx2YFDBieir_U77CcQbH-4rhpZ8BHxty86KD2HgV51Cd74IKmcUW8wi6rhrxKQm_r1QryPac-6xicld4tBOa"],'normal',pkg)
  });

})