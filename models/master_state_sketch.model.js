const Enum = require("enum");
const ServiceStateEnum = require('../models/service_state.enum').ServiceStateEnum;

const MasterStateSketchEnum = new Enum([
    "Serving",
    "Unavailable",
    "Appointment",
],{freeze:true,ignoreCase:true});

class BaseStateSketchModel{
    constructor(guid,startAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,previousStartAt,type){
        
        this.guid = guid;
        this.startAt = startAt;
        this.endAt = endAt;
        this.createdAt = createdAt;
        this.canceledAt = canceledAt;
        this.lastModifiedAt = lastModifiedAt;
        this.addSubMinutes = addSubMinutes;
        this.previousStartAt = previousStartAt;
        this.type = type;
    }
    toJson(){
        // convert obj to json
        let result = {
            guid:this.guid,
            startAt:this.startAt.toISOString(),
            endAt:this.endAt == null?null:this.endAt.toISOString(),
            createdAt:this.createdAt.toISOString(),
            canceledAt:this.canceledAt == null?null:this.canceledAt.toISOString(),
            lastModifiedAt:this.lastModifiedAt == null?null:this.lastModifiedAt.toISOString(),
            addSubMinutes:this.addSubMinutes==null||this.addSubMinutes.length==0?null:this.addSubMinutes,
            previousStartAt:this.previousStartAt==null?null:this.previousStartAt.toISOString(),
            type:this.type.toString(),
        }
        /// remove keys with null value
        for(let key in result){
            if(result[key] == null){
                delete result[key];
            }
        }
        return result;
    }


}
class MasterStateSketchServingModel extends BaseStateSketchModel{
    constructor(
        guid,
        storeUid,
        orderUid,
        serviceUid,
        startedAt,
        previousStartAt,
        endAt,
        serviceDurationMinutes,
        lastModifiedAt,
        canceledAt,
        createdAt,
        addSubMinutes,
        resetAt,
        completedSeconds
    ){
        super(guid,startedAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,previousStartAt,MasterStateSketchEnum.Serving)
        this.serviceUid = serviceUid;
        this.storeUid = storeUid;
        this.orderUid = orderUid;
        this.serviceDurationMinutes = serviceDurationMinutes;
        this.resetAt = resetAt;
        this.completedSeconds = completedSeconds;
    }
    toJson(){
        let result = super.toJson();
        result.serviceUid = this.serviceUid;
        result.storeUid = this.storeUid;
        result.orderUid = this.orderUid;
        result.serviceDurationMinutes = this.serviceDurationMinutes;
        result.resetAt = this.resetAt==null? null:this.resetAt.toISOString();
        result.completedSeconds = this.completedSeconds;

                /// remove keys with null value
        for(let key in result){
            if(result[key] == null){
                delete result[key];
            }
        }
        return result;
    }

    static fromJson(json){
        return new MasterStateSketchServingModel(
            json.guid,
            json.storeUid,
            json.orderUid,
            json.serviceUid,
            new Date(json.startAt),
            json.previousStartAt==null?null:new Date(json.previousStartAt),
            json.endAt==null?null:new Date(json.endAt),
            json.serviceDurationMinutes,
            json.lastModifiedAt==null?null:new Date(json.lastModifiedAt),
            json.canceledAt==null?null:new Date(json.canceledAt),
            new Date(json.createdAt),
            json.addSubMinutes==null||json.addSubMinutes.length==0?null:json.addSubMinutes,
            json.resetAt==null?null:new Date(json.resetAt),
            json.completedSeconds
        );
    }
}

class MasterStateSketchUnavailableModel extends BaseStateSketchModel{
    constructor(guid,startAt,previousStartAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,){
        super(guid,startAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,previousStartAt,MasterStateSketchEnum.Unavailable)
    }
    toJson(){
        return super.toJson();
    }
    static fromJson(json){
        // new MasterStateSketchUnavailableModel
        return new MasterStateSketchUnavailableModel(
            json.guid,
            new Date(json.startAt),
            json.previousStartAt == null?null:new Date(json.previousStartAt),
            new Date(json.endAt),
            new Date(json.createdAt),
            json.canceledAt == null?null:new Date(json.canceledAt),
            json.lastModifiedAt == null?null:new Date(json.lastModifiedAt),
            json.addSubMinutes == null?null:json.addSubMinutes,
        );
    }
}

class MasterStateSketchAppointmentModel extends BaseStateSketchModel{
    constructor(
        guid,
        storeUid,
        orderUid,
        serviceUid,

        startAt,
        previousStartAt,
        endAt,

        serviceDurationMinutes,

        lastModifiedAt,
        canceledAt,

        createdAt,
        addSubMinutes,
    ){
        super(guid,startAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,previousStartAt,MasterStateSketchEnum.Appointment)
        this.serviceUid = serviceUid;
        this.storeUid = storeUid;
        this.orderUid = orderUid;
        this.serviceDurationMinutes = serviceDurationMinutes;
        
    }
    toJson(){
        let result = super.toJson();
        result.serviceUid = this.serviceUid;
        result.storeUid = this.storeUid;
        result.orderUid = this.orderUid;
        result.serviceDurationMinutes = this.serviceDurationMinutes;
        // check null value and remove it
        for(let key in result){
            if(result[key] == null){
                delete result[key];
            }
        }
        // console.log("-------------------------------------------------");
        // console.log(JSON.stringify(result));
        // console.log("-------------------------------------------------");
        return result;
    }

    static fromJson(json){
        return new MasterStateSketchAppointmentModel(
            json.guid,
            json.storeUid,
            json.orderUid,
            json.serviceUid,
            new Date(json.startAt),
            json.previousStartAt==null?null:new Date(json.previousStartAt),
            new Date(json.endAt),
            json.serviceDurationMinutes,
            json.lastModifiedAt==null?null:new Date(json.lastModifiedAt),
            json.canceledAt==null?null:new Date(json.canceledAt),
            new Date(json.createdAt),
            json.addSubMinutes==null||json.addSubMinutes.length==0?null:json.addSubMinutes,
        );
    }
}

module.exports = {
    MasterStateSketchServingModel,
    MasterStateSketchUnavailableModel,
    MasterStateSketchAppointmentModel,
    MasterStateSketchEnum,
}




// class MasterStateSketchServiceModel{
//     constructor(
//         guid,
//         serviceGuid,
//         state,
//         appointmentStartAt,
//         previousAppointmentStartAt,
//         startedAt,
//         assertCompletedAt,
//         totalServiceMinutes,
//         previousTotalServiceMinutes,
//         hostUid,
//         lastModifiedAt,
//         canceledAt,
//         createdAt,
//     ){
//         super(guid,startAt,endAt,createdAt,canceledAt,lastModifiedAt,addSubMinutes,previousStartAt,type)
//         this.type = MasterStateSketchEnum.Serving;
//         this.guid = guid;
//         this.serviceGuid = serviceGuid;
//         this.state = state;
//         this.appointmentStartAt = appointmentStartAt;
//         this.previousAppointmentStartAt = previousAppointmentStartAt;
//         this.startedAt = startedAt;
//         this.assertCompletedAt = assertCompletedAt;
//         this.totalServiceMinutes = totalServiceMinutes;
//         this.previousTotalServiceMinutes = previousTotalServiceMinutes;
//         this.hostUid = hostUid;
//         this.lastModifiedAt = lastModifiedAt;
//         this.canceledAt = canceledAt;
//         this.createdAt = createdAt;
//     }
//     toJson(){
//         var result = {
//             guid: this.guid,
//             serviceGuid:this.serviceGuid,
//             type: this.type.toString(),
//             state: this.state.toString(),
//             appointmentStartAt: this.appointmentStartAt == null?null:this.appointmentStartAt.toISOString(),
//             previousAppointmentStartAt: this.previousAppointmentStartAt == null?null:this.previousAppointmentStartAt.toISOString(),
//             startedAt: this.startedAt == null?null:this.startedAt.toISOString(),
//             assertCompletedAt: this.assertCompletedAt == null?null:this.assertCompletedAt.toISOString(),
//             totalServiceMinutes: this.totalServiceMinutes,
//             previousTotalServiceMinutes: this.previousTotalServiceMinutes,
//             hostUid: this.hostUid,
//             lastModifiedAt: this.lastModifiedAt == null?null:this.lastModifiedAt.toISOString(),
//             canceledAt: this.canceledAt == null?null:this.canceledAt.toISOString(),
//             createdAt: this.createdAt == null?null:this.createdAt.toISOString(),
//         };
//         /// remove keys with null value
//         for(var key in result){
//             if(result[key] == null){
//                 delete result[key];
//             }
//         }
//         return result;
//     }

//     static fromJson(json){
//         return new MasterStateSketchServiceModel(
//             json.guid,
//             json.serviceGuid,
//             ServiceStateEnum[json.state],
//             json.appointmentStartAt == null?null:new Date(json.appointmentStartAt),
//             json.previousAppointmentStartAt == null?null:new Date(json.previousAppointmentStartAt),
//             json.startedAt == null?null:new Date(json.startedAt),
//             json.assertCompletedAt == null?null:new Date(json.assertCompletedAt),
//             json.totalServiceMinutes,
//             json.previousTotalServiceMinutes == null?null:json.previousTotalServiceMinutes,
//             json.hostUid,
//             json.lastModifiedAt == null?null:new Date(json.lastModifiedAt),
//             json.canceledAt == null?null:new Date(json.canceledAt),
//             json.createdAt == null?null:new Date(json.createdAt),
//         );
//     }
// }