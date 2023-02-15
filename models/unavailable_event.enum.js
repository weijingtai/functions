const Enum = require('enum');
const UnavailableEventTypeEnum = new Enum([
	"created",

	"delete",
	"cancel",

	"aheadOfTime",
	"postpone",
	
    "updateStartAt",
    "updateEndAt",
],{freeze:true,ignoreCase:true})

module.exports = UnavailableEventTypeEnum