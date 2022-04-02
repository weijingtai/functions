
const DeviceNotificationToken = require("../models/DeviceNotificationToken");
const OnlineInfoRepository = require("./OnlineInfo.reposiotry");
const expect = require("chai").expect;

describe("DeviceNotificationToken",()=>{
  it("get DeviceNotificationToken List From OnlineInfoCollection Snapshot Data",()=>{
    var testSnapshotData = {
    "deviceType": "ios",
    "reportAt": "2022-03-24T17:53:52.728374",
    "deviceInfo": {
        "isPhysicalDevice": "true",
        "utsname": {
            "release": "21.3.0",
            "version": "Darwin Kernel Version 21.3.0: Wed Jan  5 21:44:43 PST 2022; root:xnu-8019.80.24~23/RELEASE_ARM64_T8020",
            "nodename": "jingtais-iPhoneXR",
            "machine": "iPhone11,8",
            "sysname": "Darwin"
        },
        "localizedModel": "iPhone",
        "systemVersion": "15.3.1",
        "systemName": "iOS",
        "name": "jingtai’s iPhoneXR",
        "model": "iPhone",
        "identifierForVendor": "5571CF3D-64D6-45CD-8820-AAA385130352"
    },
    "notifyTokenList": [
        {
            "type": "apns",
            "token": "AE1D90978E81D99BB4FD6A6485EF51DBD0977BBB6A54C35D6FC89953A5E25267"
        },
        {
            "type": "fcm",
            "token": "fTLNT7nn2kw_lhE96szaWa:APA91bGEQmdzS1dXl5k6eDtTYOKfshrIOO0eMTnw6k93LQAdld_ICogtU7FrBZ1d2Qho-TodurIl5z571PwhEsqzyUTJz1VO4SV3BJHM-H5NHbRtgyHDjijB4uCyVn2SHw6PX1sa9ZfM"
        }
    ]
}
    var resultList = OnlineInfoRepository.getDeviceNotificationToken("test_uid",testSnapshotData);
    expect(resultList.tokenList.length == 2).to.be.true;
    var first = resultList.tokenList[0];
    var second = resultList.tokenList[1];
    expect(first.json.type).to.eq("apns");
    expect(first.json.token).to.eq("AE1D90978E81D99BB4FD6A6485EF51DBD0977BBB6A54C35D6FC89953A5E25267");
    
    expect(second.json.type).to.eq(testSnapshotData["notifyTokenList"][1]["type"]);
    expect(second.json.token).to.eq(testSnapshotData["notifyTokenList"][1]["token"]);
    // expect(resultList.deviceType).to.eq(testSnapshotData['deviceType']);
  });

})