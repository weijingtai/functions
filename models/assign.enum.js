const Enum = require("enum");
const AssignStateEnum = new Enum([
    "Preparing",
    "Delivering",
    "Assigning",
    "Canceled", // same as Preparing
    "Rejected",
    "Accepted",
    "Timeout",
    "Deleted",
],{freeze:true,ignoreCase:true})
const AssignEventEnum = new Enum([
    "Init", // trigger assign's Preparing state
    "Send", // trigger assign's Delivering state
    "Received", // trigger assign's Assigning state
    "Cancel", // trigger assign's Canceled state
    "Reject", // trigger assign's Rejected state    
    "Accept", // trigger assign's Accepted state
    "Timeout", // trigger assign's Timeout state
    "Delete",
],{freeze:true,ignoreCase:true});
module.exports = {
    AssignStateEnum: AssignStateEnum,
    AssignEventEnum: AssignEventEnum,
}