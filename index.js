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
const serviceHandler = require('./handlers/service.handler');
const ServiceModel = require('./models/service.model');
exports.serviceStateTrigger = firestore
.document('Service/{serviceGuid}')
.onUpdate( async (change, context) => {
  logger.info(`[trigger] service updated`, {structuredData: true});
  var preService = change.before.data();
  var curService = change.after.data();
  logger.debug(`[trigger] old=${JSON.stringify(preService)}`, {structuredData: true});
  logger.debug(`[trigger] new=${JSON.stringify(curService)}`, {structuredData: true});
  var preService = ServiceModel.fromJson(change.before.data());
  var curService =  ServiceModel.fromJson(change.after.data());
  if (preService.state != curService.state){
    logger.info(`[trigger] service state changed`, {structuredData: true});
    await serviceHandler.whenServiceStateChanged(preService, curService);
  }
  // trigger when service totalServiceMinutes changed
  if (preService.totalServiceMinutes != curService.totalServiceMinutes){
    logger.info(`[trigger] service totalServiceMinutes changed`, {structuredData: true});
    await serviceHandler.whenServiceTotalServiceMinutesChanged(preService, curService);
  }
  // if ((preService.appointmentStartAt.getTime()/1000) != (curService.appointmentStartAt.getTime()/1000)){
  if (preService.appointmentStartAt.getTime() != curService.appointmentStartAt.getTime()){
    logger.info(`[trigger] service appointmentStartAt changed`, {structuredData: true});
    await serviceHandler.whenServiceStartAtChanged(preService, curService);
  }



  // assert service's update is reset
  // 1. service is completed or finished
  let preServiceStateStr = preService.state.toString();
  // if (preServiceStateStr == "Completed" || preServiceStateStr == "Finished"){
  // move to serviceHandler.whenServiceStateChanged(preService, curService)
  // if (preServiceStateStr == "Finished"){
  //   if (preService.doneAt != null && curService.doneAt == null){
  //     if (curService.state.toString() == "Serving"){
  //       logger.info(`[trigger] service reset when it's finished, and start serving directly`, {structuredData: true});
  //       await serviceHandler.whenServiceReset(preService, curService);
  //     }else 
  //     if(curService.state.toString() == "Paused"){
  //       logger.info(`[trigger] ervice reset when it's finished, and set state to 'Paused' waiting resume continue serving`, {structuredData: true});
  //     }
  //   }
  // }else 

  if (preServiceStateStr == "Serving" && curService.state.toString() == "Serving"){
    // when service in seving state
    // 'jump forward' or 'jump backward' should has changed with 'completedSeconds' an 'assertCompletedAt' fields at same time
    // check assertCompletedAt, cause 'completedSeconds' maybe '0' when service is in serving
    if (preService.assertCompletedAt != curService.assertCompletedAt){
        if (curService.completedSeconds <= 0){
            logger.debug(`[handler] service assertCompletedAt changed and completedSeconds set to 0, service been reset `, {structuredData: true});
            await serviceHandler.whenServiceReset(preService, curService);
        } else {
            logger.debug(`[handler] service jump time with completedSeconds from ${preService.completedSeconds} to ${curService.completedSeconds}, and assertCompletedAt from ${preService.assertCompletedAt} to ${curService.assertCompletedAt} `, {structuredData: true});
            await serviceHandler.whenServiceJump(preService,curService);
        }
    }else{
        logger.warn(`[handler] when service state is Serving, but oldService state is ${preService.state}`, {structuredData: true});
    }
  }
    
  if (preServiceStateStr == "Paused" && curService.state.toString() == "Paused"){
      // 3. service in paused
      if (preService.completedSeconds <= 0){
        logger.info(`[trigger] previous completed is ${preService.completedSeconds}, service not started yet, 'reset' and "jump backward" will not doing.`, {structuredData: true});
      }else{
        if (curService.completedSeconds <= 0){
          logger.info(`[trigger] previous completed is ${preService.completedSeconds}, current is ${curService.completedSeconds}. service will be reset.`, {structuredData: true});
          await serviceHandler.whenServiceReset(preService, curService);
        }else{
          logger.info(`[trigger] previous completed is ${preService.completedSeconds}, current is ${curService.completedSeconds}. service will be jump.`, {structuredData: true});
          await serviceHandler.whenServiceJump(preService,curService); 
        }
      }
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



/////////////////////////////////
// master unavailable
////////////////////////////////

const MasterRestHandler = require('./handlers/master_rest.handler');
const {Unavailable} = require('./models/unavailable.model');
exports.masterRestTemporaryAddedTrigger = firestore
.document('MasterRest/{masterUid}/temporary/{unavailableGuid}')
.onCreate( async (snap, context) => {
  logger.info(`[trigger] master rest temporary created`, {structuredData: true});
  logger.debug(`[trigger] master rest temporary created, data=${JSON.stringify(snap.data())}`, {structuredData: true});
  let unavailable = Unavailable.fromJson(snap.data());
  try{
    await MasterRestHandler.whenUnavailableAdded(unavailable)
    logger.info("[trigger] master rest temporary created success", {structuredData: true});
  } catch (err) {
    logger.warn(`[trigger] master rest temporary created failed, err=${err}`, {structuredData: true});
  }
})

exports.masterRestTemporaryUpdatedTrigger = firestore
.document('MasterRest/{masterUid}/temporary/{unavailableGuid}')
.onUpdate( async (change, context) => {

  logger.info(`[trigger] service updated`, {structuredData: true});

  let previousData = change.before.data();
  let currentData = change.after.data();

  logger.debug(`[trigger] ${JSON.stringify(previousData)}`, {structuredData: true});
  logger.debug(`[trigger] ${JSON.stringify(currentData)}`, {structuredData: true});

  let previous = ServiceModel.fromJson(previousData);
  let current =  ServiceModel.fromJson(currentData);
  if (previous.deletedAt == null &&  current.deletedAt != null){
    logger.debug(`[trigger] service deleted`, {structuredData: true});
  }

  // await MasterRestHandler.whenUnavailableUpdated(previous, current);
})


const UnavailableEvent = require('./models/unavailable_event.model');
exports.masterRestTemporaryEventsTrigger = firestore
.document('MasterRest/{masterUid}/temporary/{unavailableGuid}/events/{eventGuid}')
.onCreate( async (snap, context) => {
  let masterUid = context.params.masterUid;

  logger.info(`[trigger] master rest temporary event added`, {structuredData: true});
  logger.debug(`[trigger] master rest temporary event added, data=${JSON.stringify(snap.data())}`, {structuredData: true});
  let unavailableEvent = UnavailableEvent.fromJson(snap.data());
  try{
    await MasterRestHandler.whenEventAdded(masterUid,unavailableEvent)
    logger.info("[trigger] master rest temporary event added success", {structuredData: true});
  } catch (err) {
    logger.warn(`[trigger] master rest temporary event added failed, err=${err}`, {structuredData: true});
  }
})








