const ServiceStateEnum = require('../models/service_state.enum').ServiceStateEnum;
class ServiceModel{
    constructor(
        guid,
        orderGuid,
        seqInOrder,
        creatorUid,
        state,
        createdAt,
        completedSeconds = 0,
        replaceByServiceGuid,
        assignedMasterUid,
        totalServiceMinutes,
        lastModifiedAt,
        lastModifiedByUid,
        deletedAt,
        assignGuid,
        startedAt,
        pasuedAt,
        assertCompletedAt,
        doneAt,
        acceptedAt,
        appointmentStartAt,
        canceledAt,
    ){
        this.guid = guid;
        this.orderGuid = orderGuid;
        this.seqInOrder = seqInOrder;
        this.creatorUid = creatorUid;
        this.state = state;
        this.createdAt = createdAt;
        this.completedSeconds = completedSeconds;
        this.replaceByServiceGuid = replaceByServiceGuid;
        this.assignedMasterUid = assignedMasterUid;
        this.totalServiceMinutes = totalServiceMinutes;
        this.lastModifiedAt = lastModifiedAt;
        this.lastModifiedByUid = lastModifiedByUid;
        this.deletedAt = deletedAt;
        this.assignGuid = assignGuid;
        this.startedAt = startedAt;
        this.pasuedAt = pasuedAt;
        this.assertCompletedAt = assertCompletedAt;
        this.doneAt = doneAt;
        this.acceptedAt = acceptedAt;
        this.appointmentStartAt = appointmentStartAt;
        this.canceledAt = canceledAt;
    }
    toJson(){
        var result = {
            guid: this.guid,
            orderGuid: this.orderGuid,
            seqInOrder: this.seqInOrder,
            creatorUid: this.creatorUid,
            state: this.state.toString(),
            createdAt: this.createdAt == null?null:this.createdAt.toISOString(),
            completedSeconds: this.completedSeconds,
            replaceByServiceGuid: this.replaceByServiceGuid,
            assignedMasterUid: this.assignedMasterUid,
            totalServiceMinutes: this.totalServiceMinutes,
            lastModifiedAt: this.lastModifiedAt == null?null:this.lastModifiedAt.toISOString(),
            lastModifiedByUid: this.lastModifiedByUid,
            deletedAt: this.deletedAt == null?null:this.deletedAt.toISOString(),
            assignGuid: this.assignGuid,
            startedAt: this.startedAt == null?null:this.startedAt.toISOString(),
            pasuedAt: this.pasuedAt == null?null:this.pasuedAt.toISOString(),
            assertCompletedAt: this.assertCompletedAt == null?null:this.assertCompletedAt.toISOString(),
            doneAt: this.doneAt == null?null:this.doneAt.toISOString(),
            acceptedAt: this.acceptedAt == null?null:this.acceptedAt.toISOString(),
            appointmentStartAt: this.appointmentStartAt == null?null:this.appointmentStartAt.toISOString(),
            canceledAt: this.canceledAt == null?null:this.canceledAt.toISOString(),
        }
        /// remove keys with null value
        for(var key in result){
            if(result[key] == null){
                delete result[key];
            }
        }
        return result;
    }
    static fromJson(json){
        return new ServiceModel(
            json.guid,
            json.orderGuid,
            json.seqInOrder,
            json.creatorUid,
            ServiceStateEnum[json.state],
            json.createdAt == null?null:new Date(json.createdAt),
            json.completedSeconds,
            json.replaceByServiceGuid,
            json.assignedMasterUid,
            json.totalServiceMinutes,
            json.lastModifiedAt == null?null:new Date(json.lastModifiedAt),
            json.lastModifiedByUid,
            json.deletedAt == null?null:new Date(json.deletedAt),
            json.assignGuid,
            json.startedAt == null?null:new Date(json.startedAt),
            json.assertCompletedAt == null?null:new Date(json.assertCompletedAt),
            json.doneAt == null?null:new Date(json.doneAt),
            json.acceptedAt == null?null:new Date(json.acceptedAt),
            json.appointmentStartAt == null?null:new Date(json.appointmentStartAt),
            json.canceledAt == null?null:new Date(json.canceledAt),
        );
    }
}

module.exports = ServiceModel;