const { onRequest } = require('firebase-functions/v2/https');
const {firestore} = require('firebase-functions');
const { logger } = require('./logger/firebase.logger');
const httpApp = require('./app.js'); 

// Add middleware to authenticate requests

const crypto = require('crypto');
const AssignEventModel = require('./models/assign_event.model');
const { AssignEventEnum } = require('./models/assign.enum');
const { ServiceEvent } = require('./models/service_event.model');
// crypto.randomUUID()

// Expose Express API as a single Cloud Function:
exports.api = onRequest(httpApp);


// when 'Assign/{assignGuid}/events/{eventGuid}' add new doc
// update assign
exports.addAssignEvents = firestore
.document('Assign/{assignGuid}/events/{eventGuid}')
.onCreate( async (snap, context) => {
  logger.info(`[trigger] assign operation`, {structuredData: true});
  var event = snap.data();
  var assignEvent = AssignEventModel.fromJson(event);
  let result = await assignEventHandler.whenAssignEventAdded(assignEvent);
  if (result == null){
    // reponse with not   found
    logger.info(`[trigger] assign not found`, {structuredData: true});
  }else{
    if (result){
      logger.info(`[trigger] assign operate succes.`, {structuredData: true});  
    }else {
      logger.info(`[trigger] assign's state is not good for send.`, {structuredData: true});  
    }
  }
  logger.info(`[trigger] assign operation done`, {structuredData: true});
});

/// monitoring assign state changed 
/// when assign state changed, trigger functions for "notification" or update "service state"
exports.assignStateTrigger = firestore
.document('Assign/{assignGuid}')
.onUpdate( async (change, context) => {
  logger.info(`[trigger] assign updated`, {structuredData: true});
  var preAssign = change.before.data();
  var curAssign = change.after.data();
  if (preAssign.state != curAssign.state){
    logger.info(`[trigger] assign state changed`, {structuredData: true});
    assignHandler.whenAssignStateChanged(preAssign, curAssign);
  }
});

exports.assignCreated = firestore
.document('Assign/{assignGuid}')
.onCreate( async (snap, context) => {
  logger.info(`[trigger] assign created`, {structuredData: true});
  var assign = snap.data();
  logger.debug(`[trigger] assign: ${assign}`, {structuredData: true});
  await assignHandler.whenAssignCreated(assign.guid);
  logger.info(`[trigger] assign created handled finished.`, {structuredData: true});
});

exports.addServiceEvents = firestore
.document('Service/{serviceGuid}/events/{eventGuid}')
.onCreate( async (snap, context) => {
  logger.info(`[trigger] service events added.`, {structuredData: true});
  let result = await serviceEventHandler.whenServiceEventAdded(snap.data());
  if (result == null){
    // reponse with not   found
    logger.info(`[trigger] service not found`, {structuredData: true});
  }else{
    if (result){
      logger.info(`[trigger] service operate succes.`, {structuredData: true});  
    }else {
      logger.info(`[trigger] service's state is not good for send.`, {structuredData: true});  
    }
  }
  logger.info(`[trigger] assign operation done`, {structuredData: true});
});

exports.serviceStateTrigger = firestore
.document('Service/{serviceGuid}')
.onUpdate( async (change, context) => {
  logger.info(`[trigger] service updated`, {structuredData: true});
  var preService = change.before.data();
  var curService = change.after.data();
  if (preService.state != curService.state){
    logger.info(`[trigger] service state changed`, {structuredData: true});
    await serviceHandler.whenServiceStateChanged(preService, curService);
  }
});



////////////////////////////////
/// master location report
////////////////////////////////
const masterLocationReportHandler = require('./handlers/master_location.handler');

exports.addServiceEvents = firestore
.document('Locations/{masterUid}/{dateStr}/{reportGuid}')
.onCreate( async (snap, context) => {
  // get params from request
  logger.info(`[trigger] master location report handled`, {structuredData: true});
  let masterUid = context.params.masterUid;
  await masterLocationReportHandler.onLocationChanged(masterUid, snap.data());
  logger.info(`[trigger] master location report handled`, {structuredData: true});
});







