
const Enum = require('enum')

const OrderStateEnum = new Enum({
  'creating':0,
  'assigning':1,
  'wating':2,
  'serving':3,
  'canceled':4,
  'completed':5
},{freeze:true,ignoreCase: true})
const AssignStateEnum = new Enum({
  Preparing:0,
  Assigning:1,
  Canceled:2,
  Rejected:3,
  Accepted:4,
  Timeout:4,
},{freeze:true,ignoreCase:true})


module.exports = {
    OrderStateEnum: OrderStateEnum,
    AssignStateEnum: AssignStateEnum,
}