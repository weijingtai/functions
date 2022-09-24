const AssignStateEnum = require("../models/assign.enum").AssignStateEnum;
const OrderStatusEnum = require("../models/order.enum").OrderStatusEnum;
class AssignModel{
    get isDeleted(){
        return this.deletedAt != null;
    }
    constructor(
        guid,
        masterUid,
        serviceGuid,
        orderGuid,
        hostUid,
        assignTimeoutSeconds,
        deliverTimeoutSeconds,
        currentOrderStatus,
        senderUid,
        createdAt,
        state = AssignStateEnum.Preparing,
        assignAt,
        canceledAt,
        deliveredAt,
        respondedAt,
        lastModifiedAt,
        deletedAt,
        timeoutAt,
    ){
        this.guid = guid;
        this.masterUid = masterUid;
        this.serviceGuid = serviceGuid;
        this.orderGuid = orderGuid;
        this.hostUid = hostUid;
        this.assignTimeoutSeconds = assignTimeoutSeconds;
        this.deliverTimeoutSeconds = deliverTimeoutSeconds;
        this.currentOrderStatus = currentOrderStatus;
        this.senderUid = senderUid;
        this.createdAt = createdAt;
        this.state = state;
        this.assignAt = assignAt;
        this.canceledAt = canceledAt;
        this.deliveredAt = deliveredAt;
        this.respondedAt = respondedAt;
        this.lastModifiedAt = lastModifiedAt;
        this.deletedAt = deletedAt;
        this.timeoutAt = timeoutAt;
    }
    toJson(){
        let result = {};
        result.guid = this.guid;
        result.masterUid = this.masterUid;
        result.serviceGuid = this.serviceGuid;
        result.orderGuid = this.orderGuid;
        result.hostUid = this.hostUid;
        result.assignTimeoutSeconds = this.assignTimeoutSeconds;
        result.deliverTimeoutSeconds = this.deliverTimeoutSeconds;
        result.currentOrderStatus = this.currentOrderStatus.toString();
        result.senderUid = this.senderUid;
        if (this.createdAt != null){
            result.createdAt = this.createdAt.toISOString();
        }
        result.state = this.state.toString();
        if (this.assignAt != null){
            result.assignAt = this.assignAt.toISOString();
        }
        if (this.canceledAt != null){
        result.canceledAt = this.canceledAt.toISOString();
        }
        if (this.deliveredAt != null){
            result.deliveredAt = this.deliveredAt.toISOString();
        }
        if (this.respondedAt != null){
            result.respondedAt = this.respondedAt.toISOString();
        }
        if (this.lastModifiedAt != null){
            result.lastModifiedAt = this.lastModifiedAt.toISOString();
        }
        if (this.deletedAt != null){
            result.deletedAt = this.deletedAt.toISOString();
        }
        if (this.timeoutAt != null){
            result.timeoutAt = this.timeoutAt.toISOString();
        }
        return result;
    }
    static fromJson(json){
        return new AssignModel(
        json.guid,  //guid
        json.masterUid, //masterUid
        json.serviceGuid, //serviceGuid
        json.orderGuid, //orderGuid
        json.hostUid, //hostUid
        json.assignTimeoutSeconds, //assignTimeoutSeconds
        json.deliverTimeoutSeconds,     //deliverTimeoutSeconds
        OrderStatusEnum[json.currentOrderStatus], //currentOrderStatus
        json.senderUid, //senderUid
        json.createdAt !=null?new Date(json.createdAt):null, //createdAt
        AssignStateEnum[json.state],    //state
        json.assignAt !=null?new Date(json.assignAt):null,   //assignAt
        json.canceledAt !=null?new Date(json.canceledAt):null,   //canceledAt
        json.deliveredAt !=null?new Date(json.deliveredAt):null,  //deliveredAt
        json.respondedAt !=null?new Date(json.respondedAt):null, //respondedAt
        json.lastModifiedAt !=null?new Date(json.lastModifiedAt):null,
        json.deletedAt!= null ? new Date(json.deletedAt) : null,
        json.timeoutAt != null ? new Date(json.timeoutAt) : null,
        );  //lastModifiedAt
    }

}    


module.exports = AssignModel;