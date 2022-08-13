const {
    OrderStateEnum,
} = require("./enums.js")
const {AssignStateEnum} = require("./assign.enum.js")

var HostBaseInfo = require("./HostBaseInfo")
module.exports = class OrderAssignNotification{
  constructor(
    orderGuid,
    serviceGuid,
    assignGuid,
    masterUid,
    assignState,
    orderStatus,
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
      this.orderStatus = orderStatus
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
        OrderStateEnum.get(json.orderStatus),
        json.totalServiceMinutes,
        json.totalServiceNumber,
        json.assignTimeoutSeconds,
        Date.parse(json.assignAt),
        Date.parse(json.orderCreatedAt),
        HostBaseInfo.fromJson(json.hostBaseInfo)
        )
    }
}
