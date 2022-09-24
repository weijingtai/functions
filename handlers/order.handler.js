const orderService = require('../services/order.service');
const {logger} = require('../logger/firebase.logger');

const updateActivatedOrder = async (orderId, data) => {
    logger.debug(`[handler] orderId: ${orderId}, data: ${JSON.stringify(data)}`);
    // update order 
    return await orderService.updateActivatedOrder(orderId, data);
}

module.exports = {
    updateActivatedOrder
}