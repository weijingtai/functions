const Enum = require("enum");
const ServiceEventTypeEnum = new Enum(["Appointment","Assign","Serving","Others"],{freeze:true,ignoreCase:true});
const ServingServiceEventTypeEnum = new Enum(["Reset","JumpTo","Start","Pause","Resume","Cancel","Done"],{freeze:true,ignoreCase:true});
const AppointmentEventTypeEnum = new Enum(["Setup","UpdateAppointmentStartAt","UpdateTotalServiceMinutes","Replace"],{freeze:true,ignoreCase:true});
const OthersEventTypeEnum = new Enum(["CustomerArrived","MasterOnTheWay","MasterSetSail"],{freeze:true,ignoreCase:true});

module.exports = {
    ServiceEventTypeEnum: ServiceEventTypeEnum,
    // DurationServiceEventTypeEnum: DurationServiceEventTypeEnum,
    ServingServiceEventTypeEnum: ServingServiceEventTypeEnum,
    AppointmentEventTypeEnum: AppointmentEventTypeEnum,
    OthersEventTypeEnum: OthersEventTypeEnum,
}