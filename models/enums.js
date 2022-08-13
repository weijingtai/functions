
const Enum = require('enum')

const OrderStateEnum = new Enum({
  'creating':0,
  'assigning':1,
  'wating':2,
  'serving':3,
  'canceled':4,
  'completed':5
},{freeze:true,ignoreCase: true})



module.exports = {
    OrderStateEnum: OrderStateEnum,
}