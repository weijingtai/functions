const {logger} = require('../logger/firebase.logger');
const {ServiceCollection, DeleteValue} = require('../database/firebase.database');
const ServiceModel = require('../models/service.model');
const { service } = require('firebase-functions/v1/analytics');

/// get assign by guid
/// return assign object
const getService = async (guid) => {
    logger.info(`[repository] get service`, {structuredData: true});
    logger.debug(`[repository] get service by guid: ${guid}`, {structuredData: true});
    let result = await ServiceCollection.doc(guid).get();
    if (result.exists) {
        logger.info(`[repository] service found`, {structuredData: true});
        logger.debug(`[repository] service: ${JSON.stringify(result.data())} convert to ServiceModel`, {structuredData: true});
        return ServiceModel.fromJson(result.data());
    }else{
        logger.info(`[repository] service not found`, {structuredData: true});
        return null;
    }
}
const updateService = async (guid,data) => {
    logger.info(`[repository] update service`, {structuredData: true});
    // if data not contains "lastModifiedAt" field, add it
    // only when data not contains "deletedAt"
    if (!data.hasOwnProperty("deletedAt") && !data.hasOwnProperty("lastModifiedAt")) {
        data["lastModifiedAt"] = new Date().toISOString();
    }
    // replace value 'null' to Firebase Detele Field
    for (let key in data) {
        if (data[key] == null) {
            data[key] = DeleteValue();
        }
    }
    logger.debug(`[repository] update service by guid: ${guid} with data: ${JSON.stringify(data)}`, {structuredData: true});
    await ServiceCollection.doc(guid).update(data);
    // otherwise, return order
    logger.info(`[repository] service updated success.`, {structuredData: true});
    return ;
}
const listServiceByOrderGuid = async (orderGuid) => {
    logger.info(`[repository] list service by order guid`, {structuredData: true});
    logger.debug(`[repository] list service by order guid: ${orderGuid}`, {structuredData: true});
    let querySnapshot = await ServiceCollection.where("orderGuid", "==", orderGuid).get();
    let services = [];
    querySnapshot.forEach((doc) => {
        services.push(ServiceModel.fromJson(doc.data()));
    });
    logger.info(`[repository] list service by order guid success with total:${services.length}.`, {structuredData: true});
    return services;
}

const countServiceByOrderGuidWithState = async (orderGuid,serviceState) => {
    logger.info(`[repository] count service by order guid with state`, {structuredData: true});
    logger.debug(`[repository] count service by order guid: ${orderGuid} with state: ${serviceState}`, {structuredData: true});
    let serviceStateStr = serviceState;
    if (typeof serviceStateStr != "string"){
        serviceStateStr = serviceState.toString();
    }
    let querySnapshot = await ServiceCollection.where("orderGuid", "==", orderGuid).where("state", "==", serviceStateStr).get();
    let total = querySnapshot.size;
    logger.info(`[repository] count service by order guid with state success with total:${total}.`, {structuredData: true});
    return total;
}

module.exports = {
    updateService,
    getService,
    listServiceByOrderGuid,
    countServiceByOrderGuidWithState
}