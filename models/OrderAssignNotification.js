const {
    OrderStateEnum,
    AssignStateEnum
} = require("./enums.js")

var HostBaseInfo = require("./HostBaseInfo")
module.exports = class OrderAssignNotification{
  constructor(
    orderGuid,
    serviceGuid,
    assignGuid,
    masterUid,
    assignState,
    orderState,
    totalServiceMinutes,
    totalServiceNumber,
    assignTimeoutSeconds,
    assignAt,
    orderCreatedAt,
    hostBaseInfo){
      this.orderGuid = orderGuid
      this.serviceGuid = serviceGuid
      this.assignGuid = assignGuid
      this.masterUid = masterUid
      this.assignState = assignState
      this.orderState = orderState
      this.totalServiceMinutes = totalServiceMinutes
      this.totalServiceNumber = totalServiceNumber
      this.assignTimeoutSeconds = assignTimeoutSeconds
      this.assignAt = assignAt
      this.orderCreatedAt = orderCreatedAt
      this.hostBaseInfo = hostBaseInfo
    }
    static fromJson(json){
      return new OrderAssignNotification(
        json.orderGuid,
        json.serviceGuid,
        json.assignGuid,
        json.masterUid,
        AssignStateEnum.get(json.assignState),
        OrderStateEnum.get(json.orderState),
        json.totalServiceMinutes,
        json.totalServiceNumber,
        json.assignTimeoutSeconds,
        Date.parse(json.assignAt),
        Date.parse(json.orderCreatedAt),
        HostBaseInfo.fromJson(json.hostBaseInfo)
        )
    }
}
