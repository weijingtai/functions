// exports.masterUserAccept = 

async function handleMasterAcceptAssign(previous,current){
    let orderGuid = current.orderGuid;
    functions.logger.info(`masterUserAccept: masterUid:${current.masterUid} accept assignGuid:${current.guid}.`)
    // get order by current.orderGuid
    // check order is activated, not archived,
    // if order state is activated, then update this service 
    var querySnapshot = await admin.firestore().collectionGroup("activated").where("guid", "==",orderGuid).get();
    if (querySnapshot.size > 0){
        var order = querySnapshot.first.data();
        var currentOrderStatus = order.status;
        var currentTotalService = order.totalServices;
        if (currentOrderStatus != "Canceled" && currentOrderStatus != "Completed" && currentOrderStatus != "None"){
        // get service by current.serviceGuid
        // and check service's assign guid is current.guid
        // if yes, then update this service
        var serviceDoc = await admin.firestore().collection("Service").doc(current.serviceGuid).get();
        if (serviceDoc.exists){
            var serviceAssignGuid = serviceDoc.data().assignGuid;
            if (serviceAssignGuid != null && serviceAssignGuid == current.guid){
            functions.logger.debug(`masterUserAccept: update service with serviceGuid:${current.serviceGuid} to state:waiting and set masterUid.`)
            await serviceDoc.ref.update({
                state: "waiting",
                masterUid: current.masterUid,
                totalMinutes: order.totalMinutes,
                lastModifiedAt: new Date().toISOString()
            })
            functions.logger.debug(`masterUserAccept: query all service by order, and check if all service are accepted. if so, update order with orderGuid:${orderGuid} to state:accepted.`)
            if (currentOrderStatus == "Assigning"){
                var snapshot = await ServiceConllection.where("orderGuid", "==", orderGuid).where("state","==","waiting").get()
                // check snapshot is not empty
                if (currentTotalService == snapshot.size){
                    functions.logger.debug(`masterUserAccept: all service are accepted, update order with orderGuid:${orderGuid} to state:accepted.`)
                    var orderRef = await admin.firestore().collectionGroup('activated').where("guid", "==",orderGuid).get();
                    // get first documentSnapshot
                    if (querySnapshot.size > 0){
                        let order = querySnapshot.docs[0];
                        if (order.exists) {
                            // console.log(`Document found with name '${documentSnapshot.id}'`);
                            await orderRef.ref.update({
                                status: "Waiting",
                                previousStatus: "Assigning",
                                lastModifiedAt: new Date().toISOString()
                            });
                            functions.logger.debug(`masterUserAccept: update order with orderGuid:${orderGuid} to status:Waiting success.`);
                        }else{
                            functions.logger.warn(`masterUserAccept: order collectionGroup with 'activated' where orderGuid:${orderGuid} not found.`)
                        }
                    }else{
                        functions.logger.warn(`masterUserAccept: order collectionGroup with 'activated' where orderGuid:${orderGuid} not found.`)
                    }
                }else{
                    functions.logger.debug(`masterUserAccept: not all service are accepted (${acceptedCount}/${serviceListSize}), do nothing.`)
                }
            }

            }else{
            functions.logger.debug(`masterUserAccept: service assignGuid:${serviceAssignGuid} is not current.guid:${current.guid}.`)
            }
        }else{
            functions.logger.debug(`masterUserAccept: service serviceGuid:${current.serviceGuid} not exist.`)
        }
        }else{
            functions.logger.warn(`masterUserAccept: order is ${order.status}, can't accept.`)
        }
    }else{
        functions.logger.debug(`masterUserAccept: order not found by orderGuid:${orderGuid}.`)
    }
        
}

module.exports = {
    masterUserAccept: handleMasterAcceptAssign
}