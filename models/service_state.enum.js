
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
module.exports = {
    ServiceStateEnum: ServiceStateEnum    
};
