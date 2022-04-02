
var admin = require('firebase-admin');
var serviceAccount = require("../massage-o2o-dev-7fd17798efec.json");

var initedAdmin = null
function getAdmin(){
    if (initedAdmin == null){
        initedAdmin = admin
        initedAdmin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://massage-o2o-dev-default-rtdb.firebaseio.com",
            storageBucket: "massage-o2o-dev.appspot.com"
        });
    }
    return initedAdmin;
}


module.exports = getAdmin