const {logger} = require('../logger/firebase.logger');
const {AssignCollection, DeleteValue} = require('../database/firebase.database');
const AssignModel = require('../models/assign.model');

/// get assign by guid
/// return assign object
const getAssign = async (guid) => {
    logger.info(`[repository] get assign`, {structuredData: true});
    logger.debug(`[repository] get assign by guid: ${guid}`, {structuredData: true});
    let result = await AssignCollection.doc(guid).get();
    if (result.exists) {
        logger.info(`[repository] assign found`, {structuredData: true});
        logger.debug(`[repository] assign: ${JSON.stringify(result.data())} convert to AssignModel`, {structuredData: true});
        return AssignModel.fromJson(result.data());
    }else{
        logger.info(`[repository] assign not found`, {structuredData: true});
        return null;
    }
}
const updateAssign = async (assignGuid,data) => {
    logger.info(`[repository] update assign`, {structuredData: true});
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
    logger.debug(`[repository] update assign by guid: ${assignGuid} with data: ${JSON.stringify(data)}`, {structuredData: true});
    await AssignCollection.doc(assignGuid).update(data);
    // otherwise, return order
    logger.info(`[repository] assign updated success.`, {structuredData: true});
    return ;
}

module.exports = {
    updateAssign,
    getAssign
}