const { AssignEventEnum } = require("./assign.enum");
const {ServiceEventTypeEnum} = require("./service_event.enum");

class ServiceEvent{
    constructor(guid,serivceGuid,operatorUid,masterUid,operatedAt,type){
        this.guid = guid;
        this.serviceGuid = serivceGuid;
        this.operatorUid = operatorUid;
        this.masterUid = masterUid;
        this.operatedAt = operatedAt;
        this.type = type;
    }
    toJson(){
        let result = {
            guid: this.guid,
            serviceGuid: this.serviceGuid,
            operatorUid: this.operatorUid,
            masterUid: this.masterUid,
            operatedAt: this.operatedAt.toISOString(),
            type: this.type.key
        };
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
    fromJson(json){
        this.guid = json.guid;
        this.serviceGuid = json.serviceGuid;
        this.operatorUid = json.operatorUid;
        this.masterUid = json.masterUid;
        this.operatedAt = json.operatedAt;
        this.type = json.type;
    }
}
class BaseServiceEvent extends ServiceEvent{
    constructor(guid,serivceGuid,operatorUid,masterUid,operatedAt,type){
        super(guid,serivceGuid,operatorUid,masterUid,operatedAt,type);
    }
    toJson(){
        return super.toJson();
    }
}
class AppointmentServiceEvent extends BaseServiceEvent{
    constructor(
        guid,
        serviceGuid,
        operatorUid,
        masterUid,
        operatedAt,
        appointmentEventType,
        appointmentAt,
        totalMinutes,
        fromAppointment,
        toAppointment,
        fromTotalMinutes,
        toTotalMinutes){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,ServiceEventTypeEnum.Appointment);
        this.appointmentAt = appointmentAt;
        this.totalMinutes = totalMinutes;
        this.fromAppointment = fromAppointment;
        this.toAppointment = toAppointment;
        this.fromTotalMinutes = fromTotalMinutes;
        this.toTotalMinutes = toTotalMinutes;
        this.appointmentEventType = appointmentEventType;
    }
    toJson(){
        let result = super.toJson();
    
        if (this.appointmentAt != null){
            result.appointmentAt = this.appointmentAt.toISOString();
        }

        result.totalMinutes = this.totalMinutes;
        if(this.fromAppointment != null){
            result.fromAppointment =this.fromAppointment.toISOString();
        }
        if (this.toAppointment != null){
            result.toAppointment = this.toAppointment.toISOString();
        }
        result.fromTotalMinutes = this.fromTotalMinutes;
        result.toTotalMinutes = this.toTotalMinutes;
        result.appointmentEventType = this.appointmentEventType.key;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }

}
class ServingServiceEvent extends BaseServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,servingEventType){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,ServiceEventTypeEnum.Serving);
        this.servingEventType = servingEventType;
    }
    toJson(){
        let result = super.toJson();
        result.servingEventType = this.servingEventType.key;
        // remove if value is null or undefined
        for(let key in result){
            if(result[key] == null || result[key] == undefined){
                delete result[key];
            }
        }
        return result;
    }
}

class BaseAssignServiceEvent extends ServiceEvent{
    constructor(guid,serivceGuid,operatorUid,masterUid,operatedAt,assignGuid,assignEvent){
        super(guid,serivceGuid,operatorUid,masterUid,operatedAt,ServiceEventTypeEnum.Assign);
        this.assignGuid = assignGuid;
        this.assignEvent = assignEvent;
    }
    toJson(){
        let result = super.toJson();
        result["assignGuid"] = this.assignGuid;
        result['assignEvent'] = this.assignEvent.key;
        return result;
    }
}
class AssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Assign);
    }
    toJson(){
        return super.toJson();
    }
}
class UnassignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Unassign);
    }
    toJson(){
        return super.toJson();
    }
}
class SendAssignServiceEvent extends BaseAssignServiceEvent{
    constructor(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,isResend){
        super(guid,serviceGuid,operatorUid,masterUid,operatedAt,assignGuid,AssignEventEnum.Send);
        this.isResend = isResend;
    }
    toJson(){
        let result = super.toJson();
        result.isResend = this.isResend;
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
    ServiceEvent: ServiceEvent,
    BaseServiceEvent: BaseServiceEvent,
    AppointmentServiceEvent: AppointmentServiceEvent,
    ServingServiceEvent: ServingServiceEvent,
    BaseAssignServiceEvent: BaseAssignServiceEvent,
    AssignServiceEvent: AssignServiceEvent,
    UnassignServiceEvent: UnassignServiceEvent,
    SendAssignServiceEvent: SendAssignServiceEvent,
    CancelAssignServiceEvent: CancelAssignServiceEvent,
    AcceptAssignServiceEvent: AcceptAssignServiceEvent,
    RejectAssignServiceEvent: RejectAssignServiceEvent,
}