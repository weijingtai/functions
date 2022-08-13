
const Enum = require("enum");

const ServiceStateEnum = new Enum([
    "NoMasterSelected",
    "Preparing",
    "Assigning",
    "Waiting",
    "CustomerArrived",
    "Running",
    "Serving",
    "Paused",
    "Finished", 
    "Completed",
    "Canceled",
    "Replaced", 
],{freeze:true,ignoreCase:true});
module.exports = {
    ServiceStateEnum: ServiceStateEnum    
};
