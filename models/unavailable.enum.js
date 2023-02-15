
const Enum = require('enum');
const UnavailableCategoryEnum = new Enum([
    "Routine",
    "Temporary",
],{freeze:true,ignoreCase:true})

const UnavailableTypeEnum = new Enum([
    "Unavailable",
    "Leaving",
    "Holiday",

    "Daily",
    "Weekly",
    "Monthly",
],{freeze:true,ignoreCase:true})

module.exports = {
    UnavailableTypeEnum,
    UnavailableCategoryEnum
}