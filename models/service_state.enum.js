
const Enum = require("enum");

const ServiceStateEnum = new Enum([
    "NoMasterSelected",
    "Preparing",
    "Assigning",
    "Waiting",
    "MasterSetSail",
    "CustomerArrived",
    "Running",
    "Serving",
    "Paused",
    
    "Finished",
    "Completed",
    "Canceled",

    "Replaced", 
    "Deleted"
],{freeze:true,ignoreCase:true});
const isReadyToServingState = function(state){
    return [ServiceStateEnum.Waiting,
        ServiceStateEnum.MasterSetSail,
        ServiceStateEnum.CustomerArrived,
        ServiceStateEnum.Running].includes(state)
}
const isDoingServiceState = function(state){
    return [ServiceStateEnum.Serving,ServiceStateEnum.Paused].includes(state)
}
module.exports = {
    ServiceStateEnum,
    isReadyToServingState,
    isDoingServiceState,
};
