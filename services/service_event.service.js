const serviceEventRepository = require('../repositories/service_event.repository');
const serviceRepository = require('../repositories/service.repository');
const {logger} = require('../logger/firebase.logger');
const {ServiceEventTypeEnum,DurationServiceEventTypeEnum,ServingServiceEventTypeEnum,AppointmentEventTypeEnum} = require('../models/service_event.enum');
const {
    ServiceEvent,
    BaseServiceEvent,
    AppointmentServiceEvent,
    StartServingEvent,
    PauseServingEvent,
    CancelServingEvent,
    ResumeServingEvent,
    DoneServingEvent,
    ResetServingEvent,
    ReplaceServiceEvent,
    JumpToServingEvent,
    MasterOnTheWayServiceEvent,
    CustomerArrivedServiceEvent,

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
} = require('../models/service_event.model');
const {v4: uuidv4} = require('uuid');
const { ServiceStateEnum } = require('../models/service_state.enum');


const selectMasterServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] selectMasterServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new SelectMasterServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}
const unselectMasterServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] unselectMasterServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new UnselectMasterServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}
const sendAssignServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] sendAssignServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new SendAssignServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}
const cancelAssignServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] cancelAssignServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new CancelAssignServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}
const acceptAssignServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] acceptAssignServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new AcceptAssignServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}
const rejectAssignServiceEvent = async(serviceGuid,assignGuid, operatorUid,masterUid,operatedAt) => {
    logger.info(`[service] rejectAssignServiceEvent ${serviceGuid},${assignGuid},${operatorUid},${masterUid},${operatedAt}`, {structuredData: true});
    var event = new RejectAssignServiceEvent(uuidv4(),serviceGuid,operatorUid,masterUid,operatedAt,assignGuid);
    await serviceEventRepository.addEvent(event);
    return event;
}

const addServiceSetupEvent = async(serviceGuid,operatorUid,appointmentStartAt,totalServiceMinutes,operatedAt) => {
    logger.info(`[service] addServiceSetupEvent ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    var event = new SetupServiceEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,appointmentStartAt,totalServiceMinutes);
    logger.debug(`[service] addServiceSetupEvent ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addServiceUpdateAppointmentStartAtEvent = async(serviceGuid,operatorUid,from,to,operatedAt,) => {
    logger.info(`[service] addServiceUpdateAppointmentStartAtEvent ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    var event = new UpdateAppointmentStartAtEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,from,to);
    logger.debug(`[service] addServiceUpdateAppointmentStartAtEvent ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event; 
}
const addServiceUpdateTotalServiceMinutesEvent = async(serviceGuid,operatorUid,from,to,operatedAt) => {
    logger.info(`[service] addServiceUpdateTotalServiceMinutesEvent ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    var event = new UpdateTotalServiceMinutesEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,from,to);
    logger.debug(`[service] addServiceUpdateTotalServiceMinutesEvent ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addServiceReplaceEvent = async(serviceGuid,operatorUid,replaceByGuid,operatedAt) => {
    logger.info(`[service] addServiceReplaceEvent ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service 
    var service = await serviceRepository.getService(serviceGuid);
    if(service == null){
        logger.error(`[service] addServiceReplaceEvent service not found ${serviceGuid}`, {structuredData: true});
    }
    // caculate completed seconds
    let completedSeconds ;
    if (service.state == ServiceStateEnum.Serving){
        completedSeconds = _getCompletedSeconds(service,operatedAt);
    } else {
        completedSeconds = service.completedSeconds;
    }


    var event = new ReplaceServiceEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,replaceByGuid,completedSeconds);
    logger.debug(`[service] addServiceReplaceEvent ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;

}

const addStartServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addStartServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addStartServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let assertCompletedAt = _getAssertCompletedAt(service,operatedAt);

    var event = new StartServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,assertCompletedAt);
    logger.debug(`[service] addStartServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
    
}
function _getAssertCompletedAt(service,operatedAt){
    // calculate assertCompletedAt
    var totalServiceMilliseconds= service.totalServiceMinutes * 60000;
    
    let leftMilliseconds = totalServiceMilliseconds;
    if (service.completedSeconds > 0) {
        leftMilliseconds = leftMilliseconds -  service.completedSeconds * 1000;
    }
    return new Date(operatedAt.getTime() + leftMilliseconds);

}
function _getCompletedSeconds(service,operatedAt){
    let leftMills = service.assertCompletedAt.getTime() - operatedAt.getTime();
    return Math.ceil((service.totalServiceMinutes * 60000 - leftMills) / 1000);
}
const addPauseServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addPauseServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addPauseServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    if (service.state != ServiceStateEnum.Serving || service.assertCompletedAt ==null){
        logger.warn(`[service] addPauseServing service not in serving ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let completedSeconds = _getCompletedSeconds(service,operatedAt);
    var event = new PauseServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,completedSeconds);
    logger.debug(`[service] addPauseServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addResumeServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addResumeServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addResumeServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    if (service.state != ServiceStateEnum.Paused){
        logger.warn(`[service] addResumeServing service not in paused ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let assertCompletedAt = _getAssertCompletedAt(service,operatedAt);

    var event = new ResumeServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,assertCompletedAt);
    logger.debug(`[service] addResumeServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
    
}
const addDoneServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addDoneServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addDoneServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    if (![ServiceStateEnum.Paused,ServiceStateEnum.Serving].includes(service.state)){
        logger.warn(`[service] addDoneServing service not in serving ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let completedSeconds ;
    if (service.state == ServiceStateEnum.Serving){
        completedSeconds = _getCompletedSeconds(service,operatedAt);
    } else {
        completedSeconds = service.completedSeconds;
    }
    var event = new DoneServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,completedSeconds);
    logger.debug(`[service] addDoneServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addCancelServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addCancelServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addCancelServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    if (![ServiceStateEnum.Paused,ServiceStateEnum.Serving].includes(service.state)){
        logger.warn(`[service] addCancelServing service not in serving ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let completedSeconds ;
    if (service.state == ServiceStateEnum.Serving){
        completedSeconds = _getCompletedSeconds(service,operatedAt);
    } else {
        completedSeconds = service.completedSeconds;
    }
    var event = new CancelServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,completedSeconds);
    logger.debug(`[service] addCancelServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addResetServing = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addResetServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addResetServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    let completedSeconds ;
    if (service.state == ServiceStateEnum.Serving){
        completedSeconds = _getCompletedSeconds(service,operatedAt);
    } else {
        completedSeconds = service.completedSeconds;
    }
    var event = new ResetServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,completedSeconds);
    logger.debug(`[service] addResetServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
const addJumpToServing = async(serviceGuid,operatorUid,toCompletedSeconds,operatedAt) => {
    logger.info(`[service] addJumpToServing ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addJumpToServing service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    var event = new JumpToServingEvent(uuidv4(),serviceGuid,operatorUid,operatedAt,service.completedSeconds,toCompletedSeconds);
    logger.debug(`[service] addJumpToServing ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
    
}

const addOthersCustomerArrived = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addOthersCustomerArrived ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addOthersCustomerArrived service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    var event = new CustomerArrivedServiceEvent(uuidv4(),serviceGuid,operatorUid,operatedAt);
    logger.debug(`[service] addOthersCustomerArrived ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
    
}
const addMasterSetSail = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addMasterSetSail ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addMasterSetSail service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    var event = new MasterOnTheWayServiceEvent(uuidv4(),serviceGuid,operatorUid,operatedAt);
    logger.debug(`[service] addMasterSetSail ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
} 
const addMasterOnTheWay = async(serviceGuid,operatorUid,operatedAt) => {
    logger.info(`[service] addMasterOnTheWay ${serviceGuid},${operatorUid},${operatedAt}`, {structuredData: true});
    // get service by serviceGuid
    var service = await serviceRepository.getService(serviceGuid);
    if(service==null){
        logger.warn(`[service] addMasterOnTheWay service not found ${serviceGuid}`, {structuredData: true});
        return false;
    }
    var event = new MasterOnTheWayServiceEvent(uuidv4(),serviceGuid,operatorUid,operatedAt);
    logger.debug(`[service] addMasterOnTheWay ${event.toJson()}`, {structuredData: true});
    await serviceEventRepository.addEvent(event);
    return event;
}
module.exports = {
    selectMasterServiceEvent,
    unselectMasterServiceEvent,
    sendAssignServiceEvent,
    cancelAssignServiceEvent,
    acceptAssignServiceEvent,
    rejectAssignServiceEvent,
    addServiceSetupEvent,
    addServiceUpdateAppointmentStartAtEvent,
    addServiceUpdateTotalServiceMinutesEvent,
    addStartServing,
    addPauseServing,
    addResumeServing,
    addDoneServing,
    addCancelServing,
    addResetServing,
    addServiceReplaceEvent,
    addJumpToServing,

    addOthersCustomerArrived,
    addMasterOnTheWay,
    addMasterSetSail
}