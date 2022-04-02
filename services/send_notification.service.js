
const functions = require("firebase-functions");

const android = require("./android_notification.service");
const ios = require("./ios_notification.service");

async function sendAssignOrder(device,package){
    var deviceTypeStr = device.deviceType.toLowerCase();
    functions.logger.info(`sendAssignOrder to uid:${device.uid} with deviceType:${deviceTypeStr}`);
    switch(deviceTypeStr){
        case 'android':
            functions.logger.debug("send to android device.")
            return await android.sendOrderAssign(device,package)
            break;
        case 'ios':
            functions.logger.debug("send to ios device.")
            return await ios.sendOrderAssign(device,package);
            break;
        default:
            functions.logger.error(`sendAssignOrder by deviceType(${device.deviceType}) not implemented.`)
            throw new Error(`sendAssignOrder by deviceType(${device.deviceType}) not implemented.`);
    }
}

async function send(device,package){
    var notifyType = package.data.type.toLowerCase();
    functions.logger.info(`send: with notification type: ${notifyType}`);
    switch(notifyType){
        case 'assign':
            return await sendAssignOrder(device,package)
            // break;
        default:
            functions.logger.error(`send by notifyType(${notifyType}) not implemented.`)
            throw new Error(`send by notifyType(${notifyType}) not implemented.`);
    }
}
module.exports = {
    send:send
}

