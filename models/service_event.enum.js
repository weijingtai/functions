const Enum = require("enum");
const ServiceEventTypeEnum = new Enum(["Appointment","Assign","ServingEvent"],{freeze:true,ignoreCase:true});
const DurationServiceEventTypeEnum = new Enum(["Reset","backTo","JumpTo","AddDuration","SubtractDuration"],{freeze:true,ignoreCase:true});
const ServingServiceEventTypeEnum = new Enum(["Start","Stop","Pause","Resume","Cancel","Complete","Replace"],{freeze:true,ignoreCase:true});
const AppointmentEventTypeEnum = new Enum(["Init","UpdateDatetime","UpdateDuration","UpdateAll"],{freeze:true,ignoreCase:true});

module.exports = {
    ServiceEventTypeEnum: ServiceEventTypeEnum,
    DurationServiceEventTypeEnum: DurationServiceEventTypeEnum,
    ServingServiceEventTypeEnum: ServingServiceEventTypeEnum,
    AppointmentEventTypeEnum: AppointmentEventTypeEnum
}