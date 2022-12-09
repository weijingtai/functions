var admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
var serviceAccount = require("./massage-o2o-dev-7fd17798efec.json");

// const {getFirestore} = require('firebase-admin/firestore');
// const firestore = getFirestore();
// const firestore = admin.firestore();

var initedAdmin;

function getAdmin(){
    if (initedAdmin == null){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://massage-o2o-dev-default-rtdb.firebaseio.com",
            storageBucket: "massage-o2o-dev.appspot.com"
        });
        initedAdmin = admin;
    }
    return initedAdmin
}

module.exports = {
    getAdmin,
    FieldValue
}
