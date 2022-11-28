
const Enum = require('enum');
const RoleEnum = new Enum([
    "MASTER",
    "HOST",
],{freeze:true,ignoreCase:true})
const MasterUserGenderEnum = new Enum([
    "U", // Unknown
    "M", // Male
    "F", // Female
],{freeze:true,ignoreCase:true})
module.exports =  {
    RoleEnum,
    MasterUserGenderEnum
};