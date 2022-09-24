const Enum = require("enum");
const ServiceStateEnum = require('../models/service_state.enum').ServiceStateEnum;

const MasterStateSketchEnum = new Enum([
    "Service",
    "Disable",
],{freeze:true,ignoreCase:true});

class MasterStateSketchServiceModel{
    constructor(
        guid,
        serviceGuid,
        state,
        appointmentStartAt,
        previousAppointmentStartAt,
        startedAt,
        assertCompletedAt,
        totalServiceMinutes,
        previousTotalServiceMinutes,
        hostUid,
        lastModifiedAt,
        canceledAt,
        createdAt,
    ){
        this.type = MasterStateSketchEnum.Service;
        this.guid = guid;
        this.serviceGuid = serviceGuid;
        this.state = state;
        this.appointmentStartAt = appointmentStartAt;
        this.previousAppointmentStartAt = previousAppointmentStartAt;
        this.startedAt = startedAt;
        this.assertCompletedAt = assertCompletedAt;
        this.totalServiceMinutes = totalServiceMinutes;
        this.previousTotalServiceMinutes = previousTotalServiceMinutes;
        this.hostUid = hostUid;
        this.lastModifiedAt = lastModifiedAt;
        this.canceledAt = canceledAt;
        this.createdAt = createdAt;
    }
    toJson(){
        var result = {
            guid: this.guid,
            serviceGuid:this.serviceGuid,
            type: this.type.toString(),
            state: this.state.toString(),
            appointmentStartAt: this.appointmentStartAt == null?null:this.appointmentStartAt.toISOString(),
            previousAppointmentStartAt: this.previousAppointmentStartAt == null?null:this.previousAppointmentStartAt.toISOString(),
            startedAt: this.startedAt == null?null:this.startedAt.toISOString(),
            assertCompletedAt: this.assertCompletedAt == null?null:this.assertCompletedAt.toISOString(),
            totalServiceMinutes: this.totalServiceMinutes,
            previousTotalServiceMinutes: this.previousTotalServiceMinutes,
            hostUid: this.hostUid,
            lastModifiedAt: this.lastModifiedAt == null?null:this.lastModifiedAt.toISOString(),
            canceledAt: this.canceledAt == null?null:this.canceledAt.toISOString(),
            createdAt: this.createdAt == null?null:this.createdAt.toISOString(),
        };
        /// remove keys with null value
        for(var key in result){
            if(result[key] == null){
                delete result[key];
            }
        }
        return result;
    }

    static fromJson(json){
        return new MasterStateSketchServiceModel(
            json.guid,
            json.serviceGuid,
            ServiceStateEnum[json.state],
            json.appointmentStartAt == null?null:new Date(json.appointmentStartAt),
            json.previousAppointmentStartAt == null?null:new Date(json.previousAppointmentStartAt),
            json.startedAt == null?null:new Date(json.startedAt),
            json.assertCompletedAt == null?null:new Date(json.assertCompletedAt),
            json.totalServiceMinutes,
            json.previousTotalServiceMinutes == null?null:json.previousTotalServiceMinutes,
            json.hostUid,
            json.lastModifiedAt == null?null:new Date(json.lastModifiedAt),
            json.canceledAt == null?null:new Date(json.canceledAt),
            json.createdAt == null?null:new Date(json.createdAt),
        );
    }
}

class MasterStateSketchDisableModel{
    constructor(guid,createdAt,startAt, endAt,previousEndAt,canceledAt,lastModifiedAt){

        this.type = MasterStateSketchEnum.Disable;
        this.guid = guid;
        this.createdAt = createdAt;
        this.startAt = startAt;
        this.endAt = endAt;
        this.previousEndAt = previousEndAt;
        this.canceledAt = canceledAt;
        this.lastModifiedAt = lastModifiedAt;
    }
    toJson(){
        var result = {
            guid: this.guid,
            type: this.type.toString(),
            createdAt: this.createdAt == null?null:this.createdAt.toISOString(),
            startAt: this.startAt == null?null:this.startAt.toISOString(),
            endAt: this.endAt == null?null:this.endAt.toISOString(),
            lastModifiedAt: this.lastModifiedAt == null?null:this.lastModifiedAt.toISOString(),
            previousEndAt: this.previousEndAt == null?null:this.previousEndAt.toISOString(),
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
        return new MasterStateSketchDisableModel(
            
            json.guid,
            json.createdAt == null?null:new Date(json.createdAt),
            json.startAt == null?null:new Date(json.startAt),
            json.endAt == null?null:new Date(json.endAt),
            json.previousEndAt == null?null:new Date(json.previousEndAt),
            json.canceledAt == null?null:new Date(json.canceledAt),
            json.lastModifiedAt == null?null:new Date(json.lastModifiedAt),
        );

    }
}

module.exports = {
    MasterStateSketchServiceModel,
    MasterStateSketchDisableModel,
    MasterStateSketchEnum,
}