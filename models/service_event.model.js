const { AssignEventEnum } = require("./assign.enum");
const {ServiceEventTypeEnum, 
    AppointmentEventTypeEnum,
    ServingServiceEventTypeEnum,
    OthersEventTypeEnum} = require("./service_event.enum");

class ServiceEvent{
    constructor(guid,serivceGuid,operatorUid,operatedAt,type){
        this.guid = guid;
        this.serviceGuid = serivceGuid;
        this.operatorUid = operatorUid;
        this.operatedAt = operatedAt;
        this.type = type;
    }
    toJson(){
        let result = {
            guid: this.guid,
            serviceGuid: this.serviceGuid,
            operatorUid: this.operatorUid,
            operatedAt: this.operatedAt.toISOString(),
            type: this.type.toString()
        };
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
    static fromJson(json){
        return new ServiceEvent(
            json.guid,
            json.serviceGuid,
            json.operatorUid,
            new Date(json.operatedAt),
            ServiceEventTypeEnum.fromKey(json.type)
        );
    }
}
class BaseServiceEvent extends ServiceEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,type){
        super(guid,serviceGuid,operatorUid,operatedAt,type);
    }
    toJson(){
        return super.toJson();
    }
}

/// for information
class BaseAppointmentEvent extends BaseServiceEvent{
    constructor(guid,
    serviceGuid,
    operatorUid,
    operatedAt,
    event){
        super(guid,serviceGuid,operatorUid,operatedAt,ServiceEventTypeEnum.Appointment);
        this.event = event;
    }
    toJson(){
        let result = super.toJson();
        result.event = this.event.toString();
        return result;
    }
}
class SetupServiceEvent extends BaseAppointmentEvent{
    constructor(
        guid,
        serviceGuid,
        operatorUid,
        operatedAt,
        appointmentStartAt,
        totalServiceMinutes,){
            super(guid,serviceGuid,operatorUid,operatedAt,AppointmentEventTypeEnum.Setup);
            this.appointmentStartAt = appointmentStartAt;
            this.totalServiceMinutes = totalServiceMinutes;
        }
        toJson(){
            let result = super.toJson();
            if (this.appointmentStartAt != null){
                result.appointmentStartAt = this.appointmentStartAt.toISOString();
            }
            result.totalServiceMinutes = this.totalServiceMinutes;
            // remove if value is null or undefined
            for(let key in result){
                if(result[key] == null || result[key] == undefined){
                    delete result[key];
                }
            }
            return result;
        }
}
class UpdateAppointmentStartAtEvent extends BaseAppointmentEvent{
    constructor(
        guid,
        serviceGuid,
        operatorUid,
        operatedAt,
        from,
        to,){
            super(guid,serviceGuid,operatorUid,operatedAt,AppointmentEventTypeEnum.AppointmentEventTypeEnum);
            this.from = from;
            this.to = to;
        }
        toJson(){
            let result = super.toJson();
            if (this.from != null){
                result.from = this.from.toISOString();
            }
            if (this.to != null){
                result.to = this.to.toISOString();
            }
            // remove if value is null or undefined
            for(let key in result){
                if(result[key] == null || result[key] == undefined){
                    delete result[key];
                }
            }
            return result;
        }
}
class UpdateTotalServiceMinutesEvent extends BaseAppointmentEvent{
    constructor(
        guid,
        serviceGuid,
        operatorUid,
        operatedAt,
        from,
        to,){
            super(guid,serviceGuid,operatorUid,operatedAt,AppointmentEventTypeEnum.Appointment);
            this.from = from;
            this.to = to;
        }
        toJson(){
            let result = super.toJson();
            result.to = this.to;
            result.from = this.from;
            // remove if value is null or undefined
            for(let key in result){
                if(result[key] == null || result[key] == undefined){
                    delete result[key];
                }
            }
            return result;
        }
}
class ReplaceServiceEvent extends BaseAppointmentEvent{
    constructor(
        guid,
        serviceGuid,
        operatorUid,
        operatedAt,
        replacedByServiceGuid,
        completedSeconds,){
            super(guid,serviceGuid,operatorUid,operatedAt,AppointmentEventTypeEnum.Replace);
            this.replacedByServiceGuid = replacedByServiceGuid;
            this.completedSeconds = completedSeconds;
        }
        toJson(){
            let result = super.toJson();
            result.replacedByServiceGuid = this.replacedByServiceGuid;
            result.completedSeconds = this.completedSeconds;
            // remove if value is null or undefined
            for(let key in result){
                if(result[key] == null || result[key] == undefined){
                    delete result[key];
                }
            }
            return result;
        }
}

/// for others
class OthersServiceEvent extends BaseServiceEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,event){
        super(guid,serviceGuid,operatorUid,operatedAt,ServiceEventTypeEnum.Others);
        this.event = event;
    }
    toJson(){
        let result = super.toJson();
        result.event = this.event.toString();
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
    }
}
class CustomerArrivedServiceEvent extends OthersServiceEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt){
        super(guid,serviceGuid,operatorUid,operatedAt,OthersEventTypeEnum.CustomerArrived);
    }
    toJson(){
        let result = super.toJson();
        return result;
    }
}
class MasterOnTheWayServiceEvent extends BaseAppointmentEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt){
        super(guid,serviceGuid,operatorUid,operatedAt,OthersEventTypeEnum.MasterOnTheWay);
    }
    toJson(){
        let result = super.toJson();
        return result;
    }
}
class MasterSetSailServiceEvent extends BaseAppointmentEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt){
        super(guid,serviceGuid,operatorUid,operatedAt,OthersEventTypeEnum.MasterSetSail);
    }
    toJson(){
        let result = super.toJson();
        return result;
    }
}


/// for serving
class BaseServingEvent extends BaseServiceEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,event){
        super(guid,serviceGuid,operatorUid,operatedAt,ServiceEventTypeEnum.Serving);
        this.event = event;
    }
    toJson(){
        let result = super.toJson();
        result.event = this.event.toString();
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}

class StartServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,assertCompletedAt){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Start);
        this.assertCompletedAt = assertCompletedAt;
    }
    toJson(){
        let result = super.toJson();
        result.assertCompletedAt = this.assertCompletedAt.toISOString();
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}
class ResumeServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,assertCompletedAt){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Resume);
        this.assertCompletedAt = assertCompletedAt;
    }
    toJson(){
        let result = super.toJson();
        result.assertCompletedAt = this.assertCompletedAt.toISOString();
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}
class PauseServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,completedSeconds){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Pause);
        this.completedSeconds = completedSeconds;
    }
    toJson(){
        let result = super.toJson();
        result.completedSeconds = this.completedSeconds;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}
class CancelServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,completedSeconds){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Cancel);
        this.completedSeconds = completedSeconds;
    }
    toJson(){
        let result = super.toJson();
        result.completedSeconds = this.completedSeconds;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}
class DoneServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,completedSeconds){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Done);
        this.completedSeconds = completedSeconds;
    }
    toJson(){
        let result = super.toJson();
        result.completedSeconds = this.completedSeconds;
        // remove if value is null or undefined
    
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}

class ResetServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,completedSeconds){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.Reset);
        this.completedSeconds = completedSeconds;
    }
    toJson(){
        let result = super.toJson();
        result.completedSeconds = this.completedSeconds;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}
class JumpToServingEvent extends BaseServingEvent{
    constructor(guid,serviceGuid,operatorUid,operatedAt,from,to){
        super(guid,serviceGuid,operatorUid,operatedAt,ServingServiceEventTypeEnum.JumpTo);
        this.from = from;
        this.to = to;
    }
    toJson(){
        let result = super.toJson();
        result.from = this.from;
        result.to = this.to;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}

/// for assign
class BaseAssignServiceEvent extends ServiceEvent{
    constructor(guid,serivceGuid,operatorUid,assignMasterUid,operatedAt,assignGuid,assignEvent){
        super(guid,serivceGuid,operatorUid,operatedAt,ServiceEventTypeEnum.Assign);
        this.assignGuid = assignGuid;
        this.event = assignEvent;
        this.assignMasterUid = assignMasterUid;
    }
    toJson(){
        let result = super.toJson();
        result["assignGuid"] = this.assignGuid;
        result['event'] = this.event.toString();
        result['assignMasterUid'] = this.assignMasterUid;
        return result;
    }
}
class SelectMasterServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Init);
    }
    toJson(){
        return super.toJson();
    }
}
class UnselectMasterServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Delete);
    }
    toJson(){
        return super.toJson();
    }
}
class SendAssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Send);
    }
    toJson(){
        let result = super.toJson();
        return result;
    }
}
class CancelAssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Cancel);
    }
    toJson(){
        return super.toJson();
    }
}
class AcceptAssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Accept);
    }
    toJson(){
        return super.toJson();
    }
}
class RejectAssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Reject);
    }
    toJson(){
        return super.toJson();
    }
}

module.exports = {
    ServiceEvent,
    BaseServiceEvent,
    BaseAssignServiceEvent,
    SelectMasterServiceEvent,
    UnselectMasterServiceEvent,
    SendAssignServiceEvent,
    CancelAssignServiceEvent,
    AcceptAssignServiceEvent,
    RejectAssignServiceEvent,
    SetupServiceEvent,
    UpdateAppointmentStartAtEvent,
    UpdateTotalServiceMinutesEvent,

    StartServingEvent,
    PauseServingEvent,
    ResumeServingEvent,
    CancelServingEvent,
    DoneServingEvent,
    ResetServingEvent,
    JumpToServingEvent,

    ReplaceServiceEvent,

    CustomerArrivedServiceEvent,
    MasterOnTheWayServiceEvent,
    MasterSetSailServiceEvent,
}