
class ServiceModel{
    constructor(
        guid,
        orderGuid,
        seqInOrder,
        creatorUid,
        state,
        createdAt,
        completedSeconds = 0,
        replaceeByServiceGuid,
        assignedMasterUid,totalServiceMinutes,
        lastModifiedAt,
        lastModifiedByUid,
        deletedAt,
        assignGuid,
        startedAt,
        doneAt,
        acceptedAt,
        appointmentStartAt,
        baseServiceEventList
    ){
        this.guid = guid;
        this.orderGuid = orderGuid;
        this.seqInOrder = seqInOrder;
        this.creatorUid = creatorUid;
        this.state = state;
        this.createdAt = createdAt;
        this.completedSeconds = completedSeconds;
        this.replaceeByServiceGuid = replaceeByServiceGuid;
        this.assignedMasterUid = assignedMasterUid;
        this.totalServiceMinutes = totalServiceMinutes;
        this.lastModifiedAt = lastModifiedAt;
        this.lastModifiedByUid = lastModifiedByUid;
        this.deletedAt = deletedAt;
        this.assignGuid = assignGuid;
        this.startedAt = startedAt;
        this.doneAt = doneAt;
        this.acceptedAt = acceptedAt;
        this.appointmentStartAt = appointmentStartAt;
        this.baseServiceEventList = baseServiceEventList;
    }
}