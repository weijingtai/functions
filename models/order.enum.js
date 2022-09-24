
const Enum = require('enum')

const OrderStatusEnum = new Enum({
  'None':0,
  'Creating':1,
  'Assigning':2,
  'Waiting':3,
  'Serving':4,
  'Canceled':5,
  'Completed':6
},{freeze:true,ignoreCase: true})



module.exports = {
  OrderStatusEnum: OrderStatusEnum,
}