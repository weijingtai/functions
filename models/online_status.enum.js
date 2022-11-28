const Enum = require("enum");
const OnlineStatusEnum = new Enum([
    "ONLINE",  // user logged in and online
    "OFFLINE", // current user is logged in but not online
    "LOGGED_OUT", // current user logged out
],{freeze:true,ignoreCase:true});
module.exports = {
    OnlineStatusEnum,
}