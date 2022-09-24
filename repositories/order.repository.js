const {logger} = require('../logger/firebase.logger');
const {ActivatedOrderCollection,ActivatedOrderCollectionGroup} = require('../database/firebase.database');


const getActivatedOrder = async (orderId) => {
    logger.info(`[repository] get order by guid: ${orderId}`, {structuredData: true});
    var querySnapshot = await ActivatedOrderCollectionGroup.where("guid", "==", orderId).get();
    // check querySnapshot is not empty 
    if (querySnapshot.empty) {
        logger.info(`[repository] order not found`, {structuredData: true});
        return null;
    }
    // otherwise, return order
    return querySnapshot.docs[0].data();

}
const updateActivatedOrder = async (orderId, data) => {
    // if data not contains "lastModifiedAt" field, add it
    if (!data.hasOwnProperty("lastModifiedAt")) {
        data["lastModifiedAt"] = new Date().toISOString();
    }
    var querySnapshot = await ActivatedOrderCollectionGroup.where("guid", "==", orderId).get();
    // check querySnapshot is empty or not
    if (querySnapshot.empty) {
        logger.info(`[repository] order not found`, {structuredData: true});
        return null;
    }
    // otherwise, update order
    var order = querySnapshot.docs[0];
    await order.ref.update(data);
    // return updated order
    return order.data();
}

module.exports = {
    updateActivatedOrder,
    getActivatedOrder
}