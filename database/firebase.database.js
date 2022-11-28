// var admin = require('firebase-admin');
// var serviceAccount = require("../massage-o2o-dev-7fd17798efec.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://massage-o2o-dev-default-rtdb.firebaseio.com",
//     storageBucket: "massage-o2o-dev.appspot.com"
// });
// const {getFirestore} = require('firebase-admin/firestore');
// const firestore = getFirestore();
const {getAdmin} = require('../firebase.admin');
const admin = getAdmin();
const firestore = admin.firestore();

const auth = admin.auth();

// const UserCollection = admin.firestore().collection("Users")
// const SubscribeListCollections = admin.firestore().collection("Subscribe");
// const OnlineInfoCollections = admin.firestore().collection("OnlineInfo")
// const ActivatedOrderCollection = admin.firestore().collection("ActivatedOrder")
// const ServiceCollection = admin.firestore().collection("Service")
// const UserSearchCollection = admin.firestore().collection("UserSearch")
// const TestCollection = admin.firestore().collection("test")

const UserCollection = firestore.collection("Users")
const SubscribeListCollections = firestore.collection("Subscribe");
const OnlineInfoCollections = firestore.collection("OnlineInfo")
const OnlineMastersCollection = firestore.collection("OnlineMaster");
const ActivatedOrderCollection = firestore.collection("ActivatedOrder")
const ActivatedOrderCollectionGroup = firestore.collectionGroup("activated")
const ServiceCollection = firestore.collection("Service")
const AssignCollection = firestore.collection("Assign")
const UserSearchCollection = firestore.collection("UserSearch")
const TestCollection = firestore.collection("test")
// console.log("-------------------")
console.log(`${JSON.stringify(admin.firestore.FieldValue)}`)
// console.log("-------------------")
module.exports = {
    UserCollection,
    SubscribeListCollections,
    OnlineInfoCollections,
    OnlineMastersCollection,
    ActivatedOrderCollection,
    ServiceCollection,
    UserSearchCollection,
    TestCollection,
    ActivatedOrderCollectionGroup,
    AssignCollection,
    
    // DeleteValue: admin.firestore.FieldValue.delete,
    DeleteValue:null,
    // arrayUnion: admin.firestore.FieldValue.arrayUnion,
    // arrayRemove:admin.firestore.FieldValue.arrayRemove
    
    // DeleteValue: getAdmin().firestore.FieldValue.delete,
    // arrayUnion:getAdmin().firestore.FieldValue.arrayUnion,
    // arrayRemove:getAdmin().firestore.FieldValue.arrayRemove

    auth
}
