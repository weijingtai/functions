const Enum = require("enum");
const AssignStateEnum = new Enum([
    "Preparing",
    "Delivering",
    "Assigningr",
    "Canceled",
    "Rejected",
    "Accepted",
    "Timeout",
],{freeze:true,ignoreCase:true})
const AssignEventEnum = new Enum([
    "Assign",
    "Unassign",
    "Send",
    "Cancel",
    "Reject",
    "Accept",
    "Timeout",
],{freeze:true,ignoreCase:true});
module.exports = {
    AssignStateEnum: AssignStateEnum,
    AssignEventEnum: AssignEventEnum,
}