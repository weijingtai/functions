const orederRepository = require('../repositories/order.repository');
const serviceRepository = require('../repositories/service.repository');
const {logger} = require('../logger/firebase.logger');
const { OrderStatusEnum } = require('../models/order.enum');
const { ServiceStateEnum } = require('../models/service_state.enum');



const updateActivatedOrder = async (orderId, data) => {
    // get current order at repository
    // var order = await orederRepository.getActivatedOrder(orderId);
    // if (order == null) {
    //     logger.info(`[serivce] order not found`, {structuredData: true});
    //     return null;
    // }
    // // check order is updatable or not 
    // if (order.status == "Completed" || order.status == "Cancelled") {
    //     logger.info(`[service] order is completed or cancelled`, {structuredData: true});
    //     return null;
    // }

    
    logger.debug(`[service] orderId: ${orderId}, data: ${JSON.stringify(data)}`);
    // update order 
    return await orederRepository.updateActivatedOrder(orderId, data);
}
const updateActivatedOrderToWaiting = async (orderId) => {
    // get current order at repository
    var order = await orederRepository.getActivatedOrder(orderId);
    if (order == null) {
        logger.info(`[serivce] order not found`, {structuredData: true});
        return null;
    }
    // check order is updatable or not 
    if (order.status != "Assigning"){
        logger.info(`[service] order is not Assigning`, {structuredData: true});
        return true;
    } else if (order.status == "Waiting"){
        logger.info(`[service] order already is Waiting`, {structuredData: true});
        return 
    }
    if (order.status == OrderStatusEnum.Assigning.toString()){
        // get total services in order
        let totalServices = order.totalServices;
        // get total services in order that state is Waiting
        let totalServicesWaiting = await serviceRepository.countServiceByOrderGuidWithState(order.guid, ServiceStateEnum.Waiting.toString())
        // when totalServicesWaiting == totalServices
        // update order's status to Waiting
        if (totalServicesWaiting == totalServices){
            logger.info(`[service] total:${totalServices} services is updated to waiting, update order to waiting`, {structuredData: true});
            await orederRepository.updateActivatedOrder(orderId, {status: OrderStatusEnum.Waiting.toString()});
        } else {
            logger.info(`[service] total:${totalServicesWaiting} services is waiting, but not all services(${totalServices}), not update order's status.`, {structuredData: true});
        }
        return;
    }
}
const updateActivatedOrderToCompleted = async (orderId) => {
    // get current order at repository
    var orderJsonData = await orederRepository.getActivatedOrder(orderId);
    if (orderJsonData == null) {
        logger.info(`[serivce] order not found`, {structuredData: true});
        return null;
    }
    // check order is updatable or not 
    if (orderJsonData.status != "Serving"){
        logger.info(`[service] order is not Serving`, {structuredData: true});
        return false;
    } 
    // only check when order status is Assigning
    if (orderJsonData.status == OrderStatusEnum.Serving.toString()){
        // get total services in order
        let totalServices = orderJsonData.totalServices;
        // get all services
        let allServices = serviceRepository.listServiceByOrderGuid(service.orderGuid);
        // 1. there is not service state is "Serving"
        let inServingLength =  allServices.filter(s =>[ServiceStateEnum.Serving,ServiceStateEnum.Paused].includes(s.state)).length;
        if (inServingLength > 0){
            logger.info(`[service] there is total:${inServingLength} services state is "Serving" or "Paused", not update order's status.`, {structuredData: true});
            return 
        }
        // 2. get all ended services lenght, servcie state is Finished or Completed
        let endedServicesLength = allServices.filter(s =>[ServiceStateEnum.Finished,ServiceStateEnum.Completed].includes(s.state)).length;
        // check totalServices == endedServicesLength
        if (totalServices == endedServicesLength){
            logger.info(`[service] total:${totalServices} services is updated to Finished/Completed, update order to Completed`, {structuredData: true});
            await orederRepository.updateActivatedOrder(orderId, {status: OrderStatusEnum.Completed.toString()});
            return true;
        }else{
            logger.info(`[service] total:${endedServicesLength} services is Finished/Completed, but not all services(${totalServices}), not update order's status.`, {structuredData: true});
            return false
        }
        return false;
    }
    // update order 

}
const updateOrderStatusToServing = async (orderId) => {
    // get current order at repository
    var order = await orederRepository.getActivatedOrder(orderId);
    if (order == null) {
        logger.info(`[serivce] order not found`, {structuredData: true});
        return null;
    }
    // check order is updatable or not 
    if (order.status != "Waiting"){
        logger.info(`[service] order is not Waiting`, {structuredData: true});
        return true;
    } else if (order.status == "Serving"){
        logger.info(`[service] order already is Serving`, {structuredData: true});
        return true;
    }
    var updatedField = {status: OrderStatusEnum.Serving.toString()};
    // when current service state is Waiting
    // add updated Field realStartAt
    if (order.status == OrderStatusEnum.Waiting.toString()){
        updatedField.realStartAt = new Date().toISOString();
    }
    // update order 
    return await orederRepository.updateActivatedOrder(orderId, updatedField);

}
const getActivatedOrder = async (orderId) => {
    // get current order at repository
    var order = await orederRepository.getActivatedOrder(orderId);
    if (order == null) {
        logger.info(`[serivce] order not found`, {structuredData: true});
        return null;
    }
    // check order is updatable or not 
    // if (order.status == "Completed" || order.status == "Cancelled") {
    //     logger.info(`[service] order is completed or cancelled`, {structuredData: true});
    //     return null;
    // }
    return order;
}

module.exports = {
    getActivatedOrder,
    updateActivatedOrder,
    updateActivatedOrderToWaiting,
    updateActivatedOrderToCompleted,
    updateOrderStatusToServing
}