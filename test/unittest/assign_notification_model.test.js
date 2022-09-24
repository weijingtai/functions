
// var HostBaseInfo = require("../models/HostBaseInfo.js")
var OrderAssignNotification = require("../models/OrderAssignNotification.js")
const assert = require("assert");
const expect = require("chai").expect;

describe("OrderAssignNotification",()=>{
  it("serial from jsonData",()=>{
    const testJSONData = {
      "orderGuid":"03dc46c8-0564-4961-8ce4-9669092baec3",
      "serviceGuid":"5e905d80-a20e-4f0f-8ee4-60819713b48e",
      "assignState":"Assigning",
      "masterUid":"WiqoPCGiF4uw7K3m84xSG6gZZpzG",
      "totalServiceNumber":1,
      "assignGuid":"9415c3f5-9394-4308-a90a-cbd1b95f87ae",
      "assignTimeoutSeconds":20,
      "orderState":"Assigning",
      "orderCreatedAt":"2022-03-22T18:09:14.482585",
      "assignAt":"2022-03-24T16:04:35.889316",
      "totalServiceMinutes":60,
      "hostBaseInfo":{
          "photoURL":"http://192.168.0.64:9199/download/storage/v1/b/massage-o2o-dev.appspot.com/o/headprofile%2FZnaTkKV36A8eGkRvuv6J9ctjc9rj.jpg?generation=1646528859016&alt=media",
          "uid":"ZnaTkKV36A8eGkRvuv6J9ctjc9rj",
          "displayName":"超凡按摩"
      }
    }
    var resultObject = OrderAssignNotification.fromJson(testJSONData);
    expect(resultObject instanceof OrderAssignNotification).to.be.true;
  });

})