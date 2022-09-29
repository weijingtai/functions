// var admin = require('firebase-admin');
// var serviceAccount = require("./massage-o2o-dev-7fd17798efec.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://massage-o2o-dev-default-rtdb.firebaseio.com",
//     storageBucket: "massage-o2o-dev.appspot.com"
// });

const { onRequest } = require('firebase-functions/v2/https');
const {firestore} = require('firebase-functions');
const { logger } = require('./logger/firebase.logger');
const express = require('express');
const app = express();
// const userController = require('./controllers/user.controller');

// Add middleware to authenticate requests


const {TestCollection} = require('./database/firebase.database');
app.get("/", async (req, res)  =>{
  process.env.FUNCTIONS_EMULATOR === true ? logger.info("local") : logger.info("cloud");
  res.send({
      code: 200,
      message: "Hello World"
  });
});
// build multiple CRUD interfaces:
// Add user routes
app.get("/user/:id", async (req, res)  =>{
    let id = req.params.id;
    id = parseInt(id);
    logger.log(`[api] get user by id: ${id}`, {structuredData: true});
    // var result = await userController.getUserById(id);
    TestCollection.doc().set({"ok":true});
    if (result == null){
        logger.info(`[api] user not found`, {structuredData: true});
        res.send({
            code: 404,
            message: "[api] User not found"
        });
    }else{
        logger.info(`[api] user found`, {structuredData: true});
        logger.debug(`[api] ${JSON.stringify(result)}`, {structuredData: true});
        res.send(result);
    }
});


const ios = require('./services/ios_notification.service');
app.post("/notify/:deviceId",(req, res) =>{
  ios.doSend([req.params.deviceId], "high", req.body).then((result)=>{
    res.send(result);
  });
})
const orderHandler = require('./handlers/order.handler');
app.put("/order/:guid/:operate",async(req,res)=>{
  let guid = req.params.guid;
  let operate = req.params.operate;
  logger.info(`[api] create order`, {structuredData: true});
  var result = await orderHandler.updateActivatedOrder(guid, {status: operate});
  if (result == null){
    // reponse with not   found
    logger.info(`[api] order not found`, {structuredData: true});
    res.send({
      code: 404,
      orderGuid: guid
    });
  }else{
    // return updated order
    logger.info(`[api] order found`, {structuredData: true});  
    res.send({
      code: 200,
      order: result
    });
  }

  // res.send({
    // guid: guid,
    // operate: operate
  // })
});
const serviceHandler = require('./handlers/service.handler');
app.get("/service/:guid",async(req,res)=>{
  logger.info(`[api] get service`, {structuredData: true});
  let guid = req.params.guid;
  var result = await serviceHandler.getService(guid);
  if (result == null){
    // reponse with not   found
    logger.info(`[api] service not found`, {structuredData: true});
    res.send({
      code: 404,
      msg: `service: ${guid} not found`
    });
  }else{
    // return updated order
    logger.info(`[api] service found`, {structuredData: true});  
    res.send({
      code: 200,
      data: result.toJson()
    });
  }
});
app.put("/service/:guid/:operation",async(req,res)=>{
  logger.info(`[api] update service`, {structuredData: true});
  let guid = req.params.guid;
  let operation = req.params.operation;
  // get uid from request header
  let uid = req.headers.uid;
  logger.info(`[api] uid: ${JSON.stringify(req.headers)}`, {structuredData: true});
  var result;
  if (operation == "AppointmentUpdate"){
    // get appointment from url params
    let appointment = req.headers.appointment;
    // logger.info(`[api] update service appointmentStartAt: ${req.headers.appointment}`, {structuredData: true});
    result = await serviceHandler.updateServiceAppointmentStartAt(guid, uid, new Date(appointment));
  }else if (operation == "totalMinutes") {
    result = await serviceHandler.updateServiceTotalMinutes(guid, uid, req.headers.minutes);
  } else if (operation == "jump") {
    result = await serviceHandler.updateServiceCompletedSeconds(guid, uid, req.headers.seconds);
  } else {
    result = await serviceHandler.updateService(guid,uid,operation);
  }
  if (result == null){
    // reponse with not   found
    logger.info(`[api] service not found`, {structuredData: true});
    res.send({
      code: 404,
      guid: guid
    });
  }
  else{
    // return updated order
    logger.info(`[api] service found`, {structuredData: true});  
    if (result){
      res.send({
        code: 200,
        msg: "update success."
      });
    }else{
      res.send({
        code: 400,
        msg: `service's state is not good for ${operation}.`
      });
    }
  }

});
app.delete("/service/:guid",async(req,res)=>{
  logger.info(`[api] delete service`, {structuredData: true});
  let guid = req.params.guid;
  let uid = req.headers.uid;
  var result = await serviceHandler.deleteService(guid,uid);
  if (result == null){
    // reponse with not   found
    logger.info(`[api] service not found`, {structuredData: true});
    res.send({
      code: 404,
      msg: `service: ${guid} not found`
    });
  }else{
    // return updated order
    logger.info(`[api] service found`, {structuredData: true});  
    res.send({
      code: 200,
    });
  }
});
const assignHandler = require('./handlers/assign.handler');
app.get("/assign/:guid",async (req,res)=>{
  logger.info(`[api] get assign`, {structuredData: true});
  let guid = req.params.guid;
  logger.debug(`[api] get assign by guid: ${req.params.guid}`, {structuredData: true});
  var result = await assignHandler.getAssign(guid);
  if (result == null){
    // reponse with not   found
    logger.info(`[api] assign not found`, {structuredData: true});
    res.send({
      code: 404,
      guid: guid
    });
  }
  else{
    // return updated order
    logger.info(`[api] assign found`, {structuredData: true});  
    res.send({
      code: 200,
      data: result.toJson()
    });
  }
});
app.put("/assign/:guid/:operation",async (req,res)=>{
  logger.info(`[api] get assign`, {structuredData: true});
  let guid = req.params.guid;
  let operation = req.params.operation;
  logger.debug(`[api] get assign by guid: ${req.params.guid}`, {structuredData: true});
  var result ;
  // handle operation by switch-case
  switch(operation){
    case "accept":
      result = await assignHandler.acceptAssign(guid);
      break;
    case "reject":
      result = await assignHandler.rejectAssign(guid);
      break;
    case "delivered":
      result = await assignHandler.deliveredAssign(guid);
      break;
    case "cancel":
      result = await assignHandler.cancelAssign(guid);
      break;
    case "send":
      result = await assignHandler.sendAssign(guid);
      break;
  }
  if (result == null){
    // reponse with not   found
    logger.info(`[api] assign not found`, {structuredData: true});
    res.send({
      code: 404,
      guid: guid
    });
  }
  else{
    // return updated order
    logger.info(`[api] assign found`, {structuredData: true});  
    if (result){
      res.send({
        code: 200,
        msg: "update success."
      });
    }else{
      res.send({
        code: 400,
        msg: `assign's state is not good for  ${operation}.`
      });
    }
  }
});
app.delete("/assign/:guid",async (req,res)=>{
  logger.info(`[api] get assign`, {structuredData: true});
  let guid = req.params.guid;
  logger.debug(`[api] get assign by guid: ${req.params.guid}`, {structuredData: true});
  var result = await assignHandler.deleteAssign(guid);
  if (result == null){
    // reponse with not   found
    logger.info(`[api] assign not found`, {structuredData: true});
    res.send({
      code: 404,
      guid: guid
    });
  }
  else{
    // return updated order
    logger.info(`[api] assign found`, {structuredData: true});  
    res.send({
      code: 202,
      msg: "delete success."
    });
  }
});
const assignEventHandler = require('./handlers/assign_event.handler');
app.post("/assignevents/:assignGuid/:event",async (req,res)=>{
  // get params from request
  let assignGuid = req.params.assignGuid;
  let event = req.params.event;
  // get request uid from header
  let uid = req.headers['uid'];
  // handle event by switch-case
  switch(event){
    case "accept":
      await assignEventHandler.acceptEvent(assignGuid, uid);
      break;
    case "reject":
      await assignEventHandler.rejectEvent(assignGuid, uid);
      break;
    case "received":
      await assignEventHandler.receiveEvent(assignGuid, uid);
      break;
    case "cancel":
      await assignEventHandler.cancelEvent(assignGuid, uid);
      break;
    case "send":
      await assignEventHandler.sendEvent(assignGuid, uid);
      break;
    case "delete":
      await assignEventHandler.deleteEvent(assignGuid, uid);
      break;
  }
  res.send({
    code: 200,
    msg: "event handled."
  });
});
const serviceEventHandler = require('./handlers/service_event.handler');
app.post("/serviceevents/:serviceGuid/:stage/:event",async (req,res)=>{
  // get params from request
  let serviceGuid = req.params.serviceGuid;
  let stage = req.params.stage;
  let event = req.params.event;
  // get request uid from header
  let uid = req.headers['uid'];
  let assign = req.headers['assign'];
  let masterUid = req.headers['master'];

  let result;
  // handle event by switch-case
  switch(stage){
    case "assign":
      result = await serviceEventHandler.serviceAssign(serviceGuid,assign, uid,masterUid,event);
      logger.info(`[api] service assign event handled:${result}`, {structuredData: true});
      break;
    case "appointment":
      logger.info(`[api] service appointment event handled: ${JSON.stringify(req.body)}`, {structuredData: true});
      let body = req.body;
      if (body.appointmentStartAt !=null){
        body.appointmentStartAt = new Date(body.appointmentStartAt);
      }
      if (body.from != null && typeof body.from == "string") {
        body.from = new Date(body.from);
      }
      if (body.to != null && typeof body.to == "string") {
        body.to = new Date(body.to);
      }
      logger.debug(`[api] service appointment event handled: ${typeof body.from} ${typeof body.to}`, {structuredData: true});
      result = await serviceEventHandler.serviceAppointment(serviceGuid, uid,event,body);
      break;
    case "serving":
      let servingBody = req.body;
      logger.debug(`[api] service serving event handled: ${masterUid}`, {structuredData: true});
      result = await serviceEventHandler.serviceServing(serviceGuid, masterUid,event,servingBody);
      break;
    case "others":
      result = await serviceEventHandler.serviceOthersEvent(serviceGuid, uid,event);
  }
  
  if (result != null){
    if (result){
      res.send({
        code: 200,
        data: result.toJson(),
      });
    }else{
      res.send({
        code: 400,
        msg: "event not handled."
      });
    }

  }else{
    res.send({
      code: 404,
      msg: "service not found.",
    });
  }
});
const crypto = require('crypto');
const AssignEventModel = require('./models/assign_event.model');
const { AssignEventEnum } = require('./models/assign.enum');
const { ServiceEvent } = require('./models/service_event.model');
// crypto.randomUUID()

// Expose Express API as a single Cloud Function:
exports.api = onRequest(app);


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

////////////////////////////////////
/// online master state sketch


const masterStateSketchHandler = require('./handlers/master_state_sketch.handler');
const {MasterStateSketchServiceModel,MasterStateSketchDisableModel} = require('./models/master_state_sketch.model');
app.post("/master/sketch/:masterUid/",async (req,res)=>{
  // get params from request
  logger.info(`[api] master state sketch handled`, {structuredData: true});
  let model;
  if (req.body.type == "Disable"){
    model = MasterStateSketchDisableModel.fromJson(req.body);
  }else{
    model = MasterStateSketchServiceModel.fromJson(req.body);

  }

  
  let result = await masterStateSketchHandler.add(req.params.masterUid, model);
  
  if (result != null){
    if (result){
      res.send({
        code: 200,
        data: result.toJson(),
      });
    }else{
      res.send({
        code: 400,
        msg: "event not handled."
      });
    }

  }else{
    res.send({
      code: 404,
      msg: "service not found.",
    });
  }
});
app.put("/master/sketch/:masterUid/",async (req,res)=>{
  // get params from request
  logger.info(`[api] update master state sketch handled`, {structuredData: true});
  let masterUid = req.params.masterUid;
  // get updatedFileds from request
  let updatedFields = req.body;
  // get master state sketch guid updatedFields and remove key from updatedFields
  // let guid = updatedFields.guid;
  // delete updatedFields.guid;
  let result = await masterStateSketchHandler.update(masterUid, updatedFields.guid, updatedFields);
  logger.info(`[api] update master state sketch handled`, {structuredData: true});
  logger.debug(`[api] ${JSON.stringify(result)}`, {structuredData: true});
  if (result != null){
    if (!result){
      res.send({
        code: 400,
        msg: "event not handled.",
      });
    }else{
      res.send({
        code: 200,
        data: result.toJson(),
      });
    }

  }else{
    res.send({
      code: 400,
      msg: "event not handled.",
    });
  }
});
app.delete("/master/sketch/:masterUid/",async (req,res)=>{
  // get params from request
  logger.info(`[api] update master state sketch handled`, {structuredData: true});
  let masterUid = req.params.masterUid;
  // get updatedFileds from request
  let updatedFields = req.body;
  // get master state sketch guid updatedFields and remove key from updatedFields
  let guid = updatedFields.guid;
  delete updatedFields.guid;
  let result = await masterStateSketchHandler.remove(masterUid, guid);
  logger.info(`[api] update master state sketch handled`, {structuredData: true});
  logger.debug(`[api] ${JSON.stringify(result)}`, {structuredData: true});
  if (result != null){
      res.send({
        code: 200,
        data: result.toJson(),
      });
  }else{
    res.send({
      code: 400,
      msg: "event not handled.",
    });
  }
});

app.get("/master/sketch/:masterUid/",async (req,res)=>{
  // get params from request

  let result = await masterStateSketchHandler.listAll(req.params.masterUid);
  
  if (result != null){
    if (result){
      if (result.length > 0){
        res.send({
          code: 200,
          data: result.map((item)=>item.toJson()),
        });
      }else{
        res.send({
          code: 204,
        });
      }
    }else{
      res.send({
        code: 400,
        msg: "event not handled."
      });
    }
  }else{
    res.send({
      code: 404,
      msg: "service not found.",
    });
  }
});



/// temp 09/23/2022 5:56 PM

exports.textapi = onRequest((req,resp) => {
  logger.log(cloudEvent);
  resp.send("hello world");
});

