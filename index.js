const functions = require("firebase-functions");
// const admin = require('firebase-admin');
// var serviceAccount = require("./massage-o2o-dev-7fd17798efec.json");
// admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://massage-o2o-dev-default-rtdb.firebaseio.com"
// });
const admin = require("./database/firebase.database")();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


// const bucket = admin.storage().bucket('massage-o2o-dev.appspot.com');
const bucket = admin.storage().bucket();
const userCollection = admin.firestore().collection("Users")
const FriendsCollections = admin.firestore().collection("FriendsList")
const SubscribeListCollections = admin.firestore().collection("Subscribe");
const OnlineInfoCollections = admin.firestore().collection("OnlineInfo")
const onlineRef = admin.database().ref("notification/onlineState");
const UserSearchCollection = admin.firestore().collection("UserSearch")
exports.helloworld = functions.https.onRequest((req,resp)=>{
  console.log("hello world !!")
  resp.send("hello world !!!")
})
exports.loadOnlineInfo = functions.https.onRequest((req,resp)=>{
  functions.logger.info(`loadOnlineInfo request uid:${req.query.uid}`);
   OnlineInfoCollections.doc(req.query.uid).get()
  .then((snapshot)=>{
  functions.logger.info("OnlineInfoCollections.doc(S7mUloA3Pklk6BJtYQkupjPKVwAB).get() su");
    if (snapshot.exists){
      resp.send(snapshot.data());
    }else{
      resp.send(404);
    }
  })
  .catch((error)=>{
    resp.send(error)
  })
})
exports.addMaster = functions.https.onRequest((req, resp) => {
  var userList = [
  {"displayName": "江萧曼", "phoneNumber": "+17027665337", "namePinyin": "jiangxiaoman", "age": 31, "username": "master_jiangxiaoman31", "password": "master_jiangxiaoman", "gender": false, "guid": "21977001-839c-4723-9047-8bfb9fa1914b", "claim": {"role": "MASTER"}},
  {"displayName": "田洛妃", "phoneNumber": "+17213757357", "namePinyin": "tianluofei", "age": 24, "username": "master_tianluofei24", "password": "master_tianluofei", "gender": true, "guid": "77e5f31e-e345-4ea8-8dae-9286c2e7ea4d", "claim": {"role": "MASTER"}},
  {"displayName": "田娜兰", "phoneNumber": "+18714756877", "namePinyin": "tiannalan", "age": 58, "username": "master_tiannalan58", "password": "master_tiannalan", "gender": false, "guid": "ce76babd-e345-4435-aa64-951271a94a12", "claim": {"role": "MASTER"}},
  {"displayName": "徐妙海", "phoneNumber": "+11536790388", "namePinyin": "xumiaohai", "age": 32, "username": "master_xumiaohai32", "password": "master_xumiaohai", "gender": false, "guid": "bb44fa11-dc26-4e92-b45b-f2af04b3c9ba", "claim": {"role": "MASTER"}},
  {"displayName": "钟惠然", "phoneNumber": "+13317884382", "namePinyin": "zhonghuiran", "age": 40, "username": "master_zhonghuiran40", "password": "master_zhonghuiran", "gender": true, "guid": "d273cc64-6cb3-4198-9189-23e32090e240", "claim": {"role": "MASTER"}},
  {"displayName": "林贞怡", "phoneNumber": "+14388574847", "namePinyin": "linzhenyi", "age": 51, "username": "master_linzhenyi51", "password": "master_linzhenyi", "gender": true, "guid": "a0898d94-8e19-424e-be06-cd3f7a29ae2f", "claim": {"role": "MASTER"}},
  {"displayName": "龚雨寒", "phoneNumber": "+13866383345", "namePinyin": "gongyuhan", "age": 26, "username": "master_gongyuhan26", "password": "master_gongyuhan", "gender": true, "guid": "f726cc28-017c-47a2-9a7c-4db92e7aa619", "claim": {"role": "MASTER"}},
  {"displayName": "黎莹莹", "phoneNumber": "+18287562136", "namePinyin": "liyingying", "age": 37, "username": "master_liyingying37", "password": "master_liyingying", "gender": true, "guid": "4c5b9ea6-f981-47b6-9507-78af37a650f7", "claim": {"role": "MASTER"}},
  {"displayName": "孙慧瑶", "phoneNumber": "+18532044632", "namePinyin": "sunhuiyao", "age": 33, "username": "master_sunhuiyao33", "password": "master_sunhuiyao", "gender": true, "guid": "501ecaa8-e4c3-4a27-a7a3-9b1dcd51e3be", "claim": {"role": "MASTER"}},
  {"displayName": "杨语梦", "phoneNumber": "+14565898113", "namePinyin": "yangyumeng", "age": 33, "username": "master_yangyumeng33", "password": "master_yangyumeng", "gender": true, "guid": "6f55ecf8-f618-494c-aca8-0519feb21956", "claim": {"role": "MASTER"}},
  {"displayName": "余昱文", "phoneNumber": "+17867917668", "namePinyin": "yuyuwen", "age": 38, "username": "master_yuyuwen38", "password": "master_yuyuwen", "gender": false, "guid": "87d3863d-1a95-496b-815b-da8be698b647", "claim": {"role": "MASTER"}},
  {"displayName": "陆丹琴", "phoneNumber": "+16843242957", "namePinyin": "ludanqin", "age": 22, "username": "master_ludanqin22", "password": "master_ludanqin", "gender": true, "guid": "e6e200c3-494d-449f-80be-f6edf035d103", "claim": {"role": "MASTER"}},
  {"displayName": "丁芷蕊", "phoneNumber": "+15037432779", "namePinyin": "dingzhirui", "age": 56, "username": "master_dingzhirui56", "password": "master_dingzhirui", "gender": true, "guid": "4f3e7076-3bb8-4e50-84b3-740fe1e8df5f", "claim": {"role": "MASTER"}},
  {"displayName": "贾蒙雨", "phoneNumber": "+13363213711", "namePinyin": "jiamengyu", "age": 42, "username": "master_jiamengyu42", "password": "master_jiamengyu", "gender": true, "guid": "8120dab9-332b-400a-9d0b-c7988c8681bd", "claim": {"role": "MASTER"}},
  {"displayName": "彭星儿", "phoneNumber": "+18973492931", "namePinyin": "pengxinger", "age": 56, "username": "master_pengxinger56", "password": "master_pengxinger", "gender": true, "guid": "173e6dba-a1bb-4b6d-901f-a441854e9bdf", "claim": {"role": "MASTER"}},
  {"displayName": "郝望慕", "phoneNumber": "+18688620172", "namePinyin": "haowangmu", "age": 28, "username": "master_haowangmu28", "password": "master_haowangmu", "gender": false, "guid": "56ba27de-d510-41fe-8a26-3298f642a990", "claim": {"role": "MASTER"}},
  {"displayName": "姜海燕", "phoneNumber": "+14718633429", "namePinyin": "jianghaiyan", "age": 39, "username": "master_jianghaiyan39", "password": "master_jianghaiyan", "gender": true, "guid": "993d9ec3-4c59-4cf8-9530-0b0471a03f15", "claim": {"role": "MASTER"}},
  {"displayName": "孙邵美", "phoneNumber": "+18865984572", "namePinyin": "sunshaomei", "age": 22, "username": "master_sunshaomei22", "password": "master_sunshaomei", "gender": false, "guid": "861ab1ce-84e7-425f-84ef-1cfe352877c1", "claim": {"role": "MASTER"}},
  {"displayName": "周迅", "phoneNumber": "+16145724233", "namePinyin": "zhouxun",email:"zhouxun@wjt.io", "age": 52, "username": "master_zhouxun52", "password": "wjt19951215", "gender": false, "guid": "570c8fe7-79b1-4a4c-a189-14cece377689", "claim": {"role": "MASTER"}},
  {"displayName": "王祖贤", "phoneNumber": "+12173258304", "namePinyin": "wangzuxian", "age": 25, "username": "master_wangzuxian25", "password": "master_wangzuxian", "gender": true, "guid": "0d223326-ee8f-48ca-98a8-d12ce5cda9ed", "claim": {"role": "MASTER"}},
  {"displayName": "张涵予", "phoneNumber": "+14724879429", "namePinyin": "zhanghanyu", "age": 34, "username": "master_zhanghanyu34", "password": "master_zhanghanyu", "gender": true, "guid": "ba75f76c-3750-4ce6-8965-58b26a733d53", "claim": {"role": "MASTER"}},
  {"displayName": "沈玫", "phoneNumber": "+12289205082", "namePinyin": "shenmei", "age": 47, "username": "master_shenmei47", "password": "master_shenmei", "gender": false, "guid": "c2eaa9ba-1e76-4ca1-9835-d18b4626f11b", "claim": {"role": "MASTER"}},
  {"displayName": "黄渤", "phoneNumber": "+16726631482", "namePinyin": "huangbo",emial:"huangbo@wjt.io", "age": 33, "username": "master_huangbo33", "password": "master_huangbo", "gender": true, "guid": "1c301dac-ec12-4295-9705-081ba9d89a2f", "claim": {"role": "MASTER"}},
  {"displayName": "杨紫", "phoneNumber": "+16714841389", "namePinyin": "yangzi", "age": 26, "username": "master_yangzi26", "password": "master_yangzi", "gender": false, "guid": "62390655-7fe0-4e13-bc68-706bcdc76065", "claim": {"role": "MASTER"}},
  {"displayName": "白宇", "phoneNumber": "+18566836663", "namePinyin": "baiyu",email:"baiyu@wjt.io", "age": 32, "username": "master_baiyu32", "password": "wjt19951215", "gender": true, "guid": "25295f99-fa90-48e0-a73f-08d479798ad8", "claim": {"role": "MASTER"}},
  {"displayName": "倪妮", "phoneNumber": "+16184031578", "namePinyin": "nini",email:"nini@wjt.io", "age": 36, "username": "master_nini36", "password": "wjt19951215", "gender": false, "guid": "b59c7906-b19d-4d04-bea9-6e7a2c25d0b3", "claim": {"role": "MASTER"}},
  {"displayName": "彭于晏", "phoneNumber": "+18786935861", "namePinyin": "pengyuyan", "age": 27, "username": "master_pengyuyan27", "password": "master_pengyuyan", "gender": true, "guid": "e91305c2-2816-4c84-9b06-8c83a7a3c625", "claim": {"role": "MASTER"}},
  {"displayName": "余文乐", "phoneNumber": "+15788310435", "namePinyin": "yuwenle", "age": 23, "username": "master_yuwenle23", "password": "master_yuwenle", "gender": true, "guid": "66eb21b3-6cfe-4f49-8d14-6cafaf60130d", "claim": {"role": "MASTER"}},
  {"displayName": "李现", "phoneNumber": "+13472287685", "namePinyin": "lixian", "age": 58, "username": "master_lixian58", "password": "master_lixian", "gender": true, "guid": "06abb0cf-6af1-40e8-a130-5a51b1cd9fa8", "claim": {"role": "MASTER"}},
  {"displayName": "迪丽热巴", "phoneNumber": "+12637023615", "namePinyin": "dilireba", "age": 46, "username": "master_dilireba46", "password": "master_dilireba", "gender": false, "guid": "99ab4d41-bec4-406c-b09a-70b06dcafb10", "claim": {"role": "MASTER"}},
  {"displayName": "魏和光", "phoneNumber": "+14197226119", "namePinyin": "weiheguang", "age": 22, "username": "master_weiheguang22", "password": "master_weiheguang", "gender": false, "guid": "0d7d92e7-3df9-4c3d-8afe-b7dd50eb829b", "claim": {"role": "MASTER"}},
  {"displayName": "刘阳辉", "phoneNumber": "+16362154030", "namePinyin": "liuyanghui", "age": 61, "username": "master_liuyanghui61", "password": "master_liuyanghui", "gender": true, "guid": "79895608-99dd-4766-89bf-04381cf4f5f4", "claim": {"role": "MASTER"}},
  {"displayName": "漕永贞", "phoneNumber": "+18181589771", "namePinyin": "caoyongzhen", "age": 47, "username": "master_caoyongzhen47", "password": "master_caoyongzhen", "gender": false, "guid": "0b87ce7b-c32a-4eb8-acd9-ddd6ed120c23", "claim": {"role": "MASTER"}},
  {"displayName": "姚和悌", "phoneNumber": "+12156712245", "namePinyin": "yaoheti", "age": 37, "username": "master_yaoheti37", "password": "master_yaoheti", "gender": true, "guid": "94397d9e-7df3-429e-8d2d-f59c44745de0", "claim": {"role": "MASTER"}},
  {"displayName": "谢雅达", "phoneNumber": "+17237705676", "namePinyin": "xieyada", "age": 52, "username": "master_xieyada52", "password": "master_xieyada", "gender": false, "guid": "161dbe51-ff33-472a-ae57-4680015c0f74", "claim": {"role": "MASTER"}},
  {"displayName": "黎睿才", "phoneNumber": "+16874473414", "namePinyin": "liruicai", "age": 59, "username": "master_liruicai59", "password": "master_liruicai", "gender": false, "guid": "4c4d7226-9821-4539-ac21-82106d36214f", "claim": {"role": "MASTER"}},
  {"displayName": "袁才俊", "phoneNumber": "+16112413955", "namePinyin": "yuancaijun", "age": 39, "username": "master_yuancaijun39", "password": "master_yuancaijun", "gender": true, "guid": "4c0f12bc-e7e4-466a-8624-5952b2da09fc", "claim": {"role": "MASTER"}},
  {"displayName": "萧宜人", "phoneNumber": "+11426113146", "namePinyin": "xiaoyiren", "age": 54, "username": "master_xiaoyiren54", "password": "master_xiaoyiren", "gender": false, "guid": "15a8f3ee-8e0a-44e0-9343-347c69e7d950", "claim": {"role": "MASTER"}},
  {"displayName": "常英睿", "phoneNumber": "+19683481574", "namePinyin": "changyingrui", "age": 49, "username": "master_changyingrui49", "password": "master_changyingrui", "gender": true, "guid": "2235264b-5177-406a-a6d5-dfe7ecf504e5", "claim": {"role": "MASTER"}},
  {"displayName": "史波峻", "phoneNumber": "+17767517755", "namePinyin": "shibojun", "age": 53, "username": "master_shibojun53", "password": "master_shibojun", "gender": true, "guid": "324030b8-e22a-4ce7-b184-461909208c3e", "claim": {"role": "MASTER"}},
  {"displayName": "方亮", "phoneNumber": "+17307746260", "namePinyin": "fangliang", "age": 29, "username": "master_fangliang29", "password": "master_fangliang", "gender": true, "guid": "bee8ece8-684d-4ae7-8d62-5312a132a4da", "claim": {"role": "MASTER"}},
  {"displayName": "丁佐", "phoneNumber": "+18952139427", "namePinyin": "dingzuo", "age": 36, "username": "master_dingzuo36", "password": "master_dingzuo", "gender": true, "guid": "12474160-4f1c-4fb7-8b4e-8cfafdbe46a2", "claim": {"role": "MASTER"}},
  {"displayName": "周建", "phoneNumber": "+16548009184", "namePinyin": "zhoujian", "age": 32, "username": "master_zhoujian32", "password": "master_zhoujian", "gender": false, "guid": "4e51002f-0744-40d9-828d-fa9843105ab6", "claim": {"role": "MASTER"}},
  {"displayName": "许斌", "phoneNumber": "+16628200648", "namePinyin": "xubin", "age": 64, "username": "master_xubin64", "password": "master_xubin", "gender": true, "guid": "722594b7-e3c5-4e5e-83d3-88738657ddfb", "claim": {"role": "MASTER"}},
  {"displayName": "漕震", "phoneNumber": "+18866064258", "namePinyin": "caozhen", "age": 47, "username": "master_caozhen47", "password": "master_caozhen", "gender": true, "guid": "7048eb8b-bdb2-470f-aee1-10beec6bd3d6", "claim": {"role": "MASTER"}}];

  
  var i = parseInt(req.query.number);
  var user = userList[i]
  var imageName = i+1
  let authUser = {
      username: user["username"],
      phoneNumber:user["phoneNumber"],
      displayName: user["displayName"],
      password: user["password"]}
  if (user.email != undefined){
    authUser["email"] = user.email
  }
  admin
    .auth()
    .createUser(authUser)
    .then(userAuthRecord=>{
      // var gsPath = `headprofile/${userAuthRecord.uid}.jpg`;
      return Promise.all([
        new Promise((resolve,reject)=>{resolve(userAuthRecord.uid)}),
        // upload head profile photo
        // bucket.upload(`./images/${imageName}.jpg`,{destination: gsPath}),
        // create user record
        userCollection.doc(userAuthRecord.uid)
          .set({
          // guid: user["guid"],
          uid:userAuthRecord.uid,
          gender: user["gender"]?"M":"F",
          role: "MASTER",
          username: user["username"],
          alphabetName: user["namePinyin"],
          // photoURL: gsImageUrl,
          photoGSPath: gsPath,
          displayName: user["displayName"],
          phoneNumber:user["phoneNumber"],
          age: user["age"]}),
        // setup customUserCalims
        admin.auth().setCustomUserClaims(userAuthRecord.uid, { role: "MASTER" }),
      ]);
    })
    .then((values)=>{
      let uid = values[0]
      // let gsFile = values[1]
      let photoUrl = `https://192.168.0.140/headprofile/${imageName}.jpg` 
      return Promise.all([
        admin.auth().updateUser(uid,{
          photoURL: photoUrl
        }),
        userCollection.doc(uid).update({photoURL: photoUrl}),
        UserSearchCollection.add({
          searchFiledName: "username",
          searchFiledValue: user["username"],
          uid: uid
        }),
        UserSearchCollection.add({
          searchFiledName: "displayName",
          searchFiledValue: user["displayName"],
          uid: uid
        }),
        UserSearchCollection.add({
          searchFiledName: "alphabetName",
          searchFiledValue: user["namePinyin"],
          uid: uid
        }),
        UserSearchCollection.add({
          searchFiledName: "phoneNumber",
          searchFiledValue: user["phoneNumber"].replace('\+',''),
          uid: uid
        }),
      ]);
    })
    .then(()=>{
      functions.logger.info("add user success.", {structuredData: true});
      resp.send("200")
    })
    .catch((err)=>{
      functions.logger.info(`add user failed, error:${err}`, {structuredData: true});
      resp.send("400")
    })
}); //onRequest
exports.addHost = functions.https.onRequest((req, resp) => {
  var userList = [
    {'displayName': '超凡按摩','phoneNumber': '+16269053168', 'alphabetName': 'chaofananmo', 'email':"wjt@wjt.io", 'username': 'chaofananmo_69', 'password': 'wjt19951215', 'guid': '49f5a971-1600-4a08-bcc7-3a86d1219bc2', 'location': {'address': '4120 Sanderling Cir', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89103, 'coordinate': {'latitude': 36.12449563931122, 'longitude': -115.19488944245315}}, 'orderPrefix': '00001'}, 
  {'displayName': '卓越按摩', 'phoneNumber': '+16517934296', 'alphabetName': 'zhuoyueanmo', 'email':"zhuofananmo@wjt.io", 'username': 'zhuoyueanmo_56', 'password': 'wjt19951215', 'guid': '09428433-ae80-4893-b9f4-64cacf80d946', 'location': {'address': '5353 W Desert Inn Rd #APT 1032', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89146, 'coordinate': {'latitude': 36.12879906127003, 'longitude': -115.21333811546963}}, 'orderPrefix': '00002'}, 
  {'displayName': '昌荣按摩', 'phoneNumber': '+16157819436', 'alphabetName': 'changronganmo', 'email':"changronganmo@wjt.io", 'username': 'changronganmo_38', 'password': 'wjt19951215', 'guid': 'd8499d8f-020e-43a6-88f1-5c6bb0cf83e2', 'location': {'address': '2750 S Durango Dr #2043', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89117, 'coordinate': {'latitude': 36.13727776789568, 'longitude': -115.2776398577972}}, 'orderPrefix': '00003'}, 
  {'displayName': '兴旺按摩', 'phoneNumber': '+17814818481', 'alphabetName': 'xingwanganmo', 'email':"xingwanganmo@wjt.io", 'username': 'xingwanganmo_95', 'password': 'wjt19951215', 'guid': '375a4bf9-120f-4ea7-8014-b95e902396fa', 'location': {'address': '3742 Horseshoe Mesa St', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89147, 'coordinate': {'latitude': 36.12181227357763, 'longitude': -115.30314971546977}}, 'orderPrefix': '00004'}, 
  {'displayName': '玖玖按摩', 'phoneNumber': '+13087494446', 'alphabetName': 'jiujiuanmo', 'email':"jiujiuanmo@wjt.io", 'username': 'jiujiuanmo_51', 'password': 'wjt19951215', 'guid': '825a6986-c7c6-4d2e-94c5-d0a2192f15c0', 'location': {'address': '8812 Harwich Ave', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89129, 'coordinate': {'latitude': 36.22232728575992, 'longitude': -115.28779927313944}}, 'orderPrefix': '00005'}, 
  {'displayName': '泓顺按摩', 'phoneNumber': '+13075863146', 'alphabetName': 'hongshunanmo', 'email':"hongshunanmo@wjt.io", 'username': 'hongshunanmo_72', 'password': 'wjt19951215', 'guid': 'f03c108c-3200-4c9d-9351-74bd028071a1', 'location': {'address': '6362 Agua Dr', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89103, 'coordinate': {'latitude': 36.117994197429596, 'longitude': -115.23057678038172}}, 'orderPrefix': '00006'}, 
  {'displayName': '永氏按摩', 'phoneNumber': '+14702585360', 'alphabetName': 'yongshianmo', 'email':"yongshianmo@wjt.io", 'username': 'yongshianmo_34', 'password': 'wjt19951215', 'guid': 'd54345f0-9162-403e-9c06-7063c32cccfe', 'location': {'address': '3933 S Torrey Pines Dr', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89103, 'coordinate': {'latitude': 36.117617317822535, 'longitude': -115.23464790012541}}, 'orderPrefix': '00007'}, 
  {'displayName': '云心按摩', 'phoneNumber': '+15856431966', 'alphabetName': 'yunxinanmo', 'email':"yunxinanmo@wjt.io", 'username': 'yunxinanmo_24', 'password': 'wjt19951215', 'guid': 'c9bf39fb-2b80-4c16-8b1a-2deba4ed7c6b', 'location': {'address': '8812 Harwich Ave', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89129, 'coordinate': {'latitude': 36.2223186304846, 'longitude': -115.28770271361448}}, 'orderPrefix': '00008'}, 
  {'displayName': '有贤按摩', 'phoneNumber': '+17193298809', 'alphabetName': 'youxiananmo', 'email':"youxiananmo@wjt.io", 'username': 'youxiananmo_66', 'password': 'wjt19951215', 'guid': '97b31b1f-9536-4436-a656-8cf8ff970364', 'location': {'address': '3213 Indian Moon Dr', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89129, 'coordinate': {'latitude': 36.21887374802484, 'longitude': -115.2702253308117}}, 'orderPrefix': '00009'}, 
  {'displayName': '天顺和按摩', 'phoneNumber': '+13098648207', 'alphabetName': 'tianshunheanmo', 'email':"tianshunheanmo@wjt.io", 'username': 'tianshunheanmo_74', 'password': 'wjt19951215', 'guid': 'ce8f06dc-cd4d-42fc-96b3-35c31f167e76', 'location': {'address': '515 Flemington Ct North', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89031, 'coordinate': {'latitude': 36.26860373345291, 'longitude': -115.14896520197439}}, 'orderPrefix': '00010'}, 
  {'displayName': '全杰按摩', 'phoneNumber': '+13146861893', 'alphabetName': 'quanjieanmo', 'email':"quanjieanmo@wjt.io", 'username': 'quanjieanmo_35', 'password': 'wjt19951215', 'guid': '75809282-8b53-400b-bfa2-f1dd798b4081', 'location': {'address': '3849 China Cloud Dr North', 'city': 'Las Vegas', 'state': 'Nevada(NV)', 'zip': 89031, 'coordinate': {'latitude': 36.271145777649345, 'longitude': -115.19073980012153}}, 'orderPrefix': '00011'}]
  
  var i = parseInt(req.query.number);
  var user = userList[i]
  var imageName = i+1

  var i = parseInt(req.query.number);
  var user = userList[i]
  var imageName = i+1
  admin
    .auth()
    .createUser({
      username: user["username"],
      phoneNumber:user["phoneNumber"],
      displayName: user["displayName"],
      email:user.email != null?user.email:null,
      password: user["password"]})
  .then(userAuthRecord=>{
      var gsPath = `headprofile/${userAuthRecord.uid}.jpg`;
      return Promise.all([
        new Promise((resolve,reject)=>{resolve(userAuthRecord.uid)}),
        // upload head profile photo
        // bucket.upload(`./images/h${imageName}.jpg`,{destination: gsPath}),
        // create user record
        userCollection
    .doc(userAuthRecord.uid)
    .set({
      uid:userAuthRecord.uid,
      orderPrefix: user["orderPrefix"],
      role: "HOST",
      username: user["username"],
      alphabetName: user["alphabetName"],
      photoGSPath: gsPath,
      displayName: user["displayName"],
      phoneNumber:user["phoneNumber"],
      location:{
        address: {
          street: user["location"]["address"],
          city: user["location"]["city"],
          state: user["location"]["state"],
          zip: user["location"]["zip"],
        },
        coordinate: user["location"]["coordinate"]
      }}),
        // setup customUserCalims
        admin.auth().setCustomUserClaims(userAuthRecord.uid, { role: "HOST" })
      ]);
  })
  .then((values)=>{
    let uid = values[0]
    // let gsFile = values[1]
    let photoUrl = `https://192.168.0.140/headprofile/h${imageName}.jpg`
    return Promise.all([
      admin.auth().updateUser(uid,{
        photoURL: photoUrl
      }),
      userCollection.doc(uid).update({photoURL: photoUrl}),
      UserSearchCollection.add({
        searchFiledName: "username",
        searchFiledValue: user["username"],
        uid: uid
      }),
      UserSearchCollection.add({
        searchFiledName: "displayName",
        searchFiledValue: user["displayName"],
        uid: uid
      }),
      UserSearchCollection.add({
        searchFiledName: "alphabetName",
        searchFiledValue: user["alphabetName"],
        uid: uid
      }),
      UserSearchCollection.add({
        searchFiledName: "phoneNumber",
        searchFiledValue: user["phoneNumber"].replace('\+',''),
        uid: uid
      })
    ]);
    })
  .then(()=>{
    functions.logger.info("add user success.", {structuredData: true});
    resp.send("200")
  })
  .catch((err)=>{
    functions.logger.info(`add user failed, error:${err}`, {structuredData: true});
    resp.send("400")
  })
});
const hcm = require("@blueraydigital/hms-push").default;
const hcmConfig = require("./hcm.config");
  hcm.init({
    appId: hcmConfig.AppId,
    appSecret: hcmConfig.AppSecret,
    authUrl: hcmConfig.AuthUrl,
    pushUrl: hcmConfig.PushUrl
});
exports.notifyHuawei = functions.https.onRequest((req,resp)=>{
let mc = hcm.messaging().messaging;

let AndroidConfig = {
            "collapse_key": -1,
            "urgency": "NORMAL",
            // "category": "PLAY_VOICE",
            "ttl": "1448s",
            // "bi_tag": "Trump",
            "fast_app_target": 1,
            "notification": {
                "title":"Title in android.notification",
                "body": "Body in android.notification",
                "image": "https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg!0x0.webp",
                // "icon": "/raw/ic_launcher",
                // "color": "#AACCDD",
                // "sound": "/raw/shake",
                "default_sound": true,
                "importance": "NORMAL",
                "click_action": {
                    "type": 3
                    // "intent": "intent://com.huawei.codelabpush/deeplink?#Intent;scheme=pushscheme;launchFlags=0x04000000;i.age=180;S.name=abc;end",
                    // "url": "https://www.vmall.com"
                },
                // "buttons": [
                //     {"action_type": 0, "name": "LEARN MORE"},
                //     {"action_type": 3,"name": "IGNORE"}
                // ],   
                // "body_loc_key": "demo_title_new2",
                // "body_loc_args": [
                //     "Boy",
                //     "Dog",
                //     "ff"
                // ],
                // "title_loc_key": "demo_title_new2",
                // "title_loc_args": [
                //     "Girl",
                //     "Cat",
                //     "tiger"
                // ],
                // "channel_id": "HMSTestDemo",
                // "auto_clear": 300000,
                // "notify_summary": "Some Summary",
                "style": 0,
                // "big_title": "the big title",
                // "big_body": "the big body",
                // "notify_id": 486,
                // "group": "Espace",
                "badge": {
                    "add_num": 1,
                    "class": "com.wjthub.flutter.massage.host.MainActivity"
                },
                "foreground_show": true,
                "ticker": "I am a ticker",
                // "when": "2014-10-02T15:01:23.045123456Z",
                "local_only": false,
                "use_default_vibrate": true,
                "use_default_light": true,
                "visibility": "PUBLIC",
                "vibrate_config": [
                    "1",
                    "3"
                ],
                "light_settings": {
                    "color": {
                        "alpha": 0,
                        "red": 0,
                        "green": 1,
                        "blue": 0.1
                    },
                    "light_on_duration": "3.5",
                    "light_off_duration": "5S"
                }
            }
        }
let message = {
    android: AndroidConfig,
    token: ["IQAAAACy0msfAAFkdERkUvRVqGzyAD6cc0OXe0RwJIkH1J-yFnwhNdmlK8SnxjjxKk0rWdaSFqf8HwZOI_jpndgaIuiOAHcRf5P_x2CkoB-uGAaP4Q"]
            
};    
mc.send(message, false).then(data => {
    functions.logger.info(data);
    resp.send(data)
}).catch(err => {
    functions.logger.warn(err);
    resp.send(err)
});
})
exports.notify = functions.https.onRequest((req,resp)=>{
  const options = {
    priority: "normal",
    timeToLive: 5,
    contentAvailable: true
  };
    // let data = {
      // "title": `${friendEmoji} 新好友关注提醒`,
      // "body" : `${femaleEmoji} “倪妮” 关注了你。${partyPopperEmoji}点击去“互相关注”${partyPopperEmoji}`,
      // "senderURL": "http://192.168.0.64:9199/v0/b/massage-o2o-dev.appspot.com/o/headprofile%2FScL6b07RplY3vcPzYZo9D8kcKZ9r.jpg?alt=media&token=1a036aac-646f-439c-b04a-ce99518d9bab",
      // "senderUid": "32ZoHCCumd3ACvqF4FGZqFc97D7l",
    // }
  let deviceTokenList = [
    // "f5HdX1eNRw6ckFuUy0HEtC:APA91bGkFzNRj2yegyzfC5QthCOCfKse8abkOZGnKjFqe6KcGEkSSQZ8SA91otnxpHPLgvqLb4481pcuM1-r7pT7GVYGI17jYWSMZUgXAlpbs9ABB1oE5H0JRSM8v2u2rz-N9ko_Y1W1",
    // "ffamZIUiMkcehFmu7JOoXg:APA91bHab9xoFAX4IgwYPUkOLWpziOvg0X0WiuZ8EB83iFSaQf8R8sLUYoZ6b4Xp8gdjYSKEqGP9BNiofgjQUH3Y5NlbSx3UbF7pMSZAAwFxsWNG_Iu6jTTMTRRyM8rsYVj1wg_icA8c",
    // "cqK5Aak2QJi1sth9CsCr-0:APA91bGLM3KU0OlkOyvDntmcUnqXQaTVF9-gtjCFK7Q8M74uQfuLnRRkflo86Udsxqv2p7LUBybto6Z_OkxFWVFFnougnC4NV0uSAp-YLfP9X_RXcLwBUxlyio0l1y4_7tmnjwFBOpRB"
  ]
  sendSubscribeNotification(new SubscribNotificationData(
    false,
    [
      // new DeviceToken("android","fLvt2kTARq2OIqFQ869AUc:APA91bHLoZ20SnRJ8jHO1BZ2lgert_rMW_T9xt8qA2evnlmrm6nNm3bBrZ0emorwYBpSHc4Uc0am3nHqPaw9sEJelu7gvcQ_I5GQiPOcTOKrZjZ-Ozk8szwsh0O7Wpd7gyS5RXCfPlPE"),
      // new DeviceToken("android","fb4OEwPaTNeW10wvP9Jyr3:APA91bHWqnFbw3qw7shrdHr-JTqY6JI1QH1Wlga4J7qc-rc0ZCr2b5cqrx2YFDBieir_U77CcQbH-4rhpZ8BHxty86KD2HgV51Cd74IKmcUW8wi6rhrxKQm_r1QryPac-6xicld4tBOa"),
      new DeviceNotificationToken("ios","fTLNT7nn2kw_lhE96szaWa:APA91bGEQmdzS1dXl5k6eDtTYOKfshrIOO0eMTnw6k93LQAdld_ICogtU7FrBZ1d2Qho-TodurIl5z571PwhEsqzyUTJz1VO4SV3BJHM-H5NHbRtgyHDjijB4uCyVn2SHw6PX1sa9ZfM"),
      // new DeviceToken("huawei","IQAAAACy0msfAAFkdERkUvRVqGzyAD6cc0OXe0RwJIkH1J-yFnwhNdmlK8SnxjjxKk0rWdaSFqf8HwZOI_jpndgaIuiOAHcRf5P_x2CkoB-uGAaP4Q")
    ],
    new UserBaseInfo(
      "32ZoHCCumd3ACvqF4FGZqFc97D7l",
      "https://firebasestorage.googleapis.com/v0/b/wjt-home.appspot.com/o/headProfile%2Fkongli_1.jpg?alt=media&token=8049393f-1d71-4e49-8977-5487725e78d9",
      "孔礼",
      "F",
      "MASTER")
  ))
  .then(res=>{
    functions.logger.info(`${JSON.stringify(res)}`, {structuredData: true})
    resp.send({result: res})
  })
  .catch(err=>{
    resp.send(err)
  })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// real logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const femaleEmoji = "🙋‍♀️";
const maleEmoji = "🙋‍♂️";
const friendEmoji = "👥";
const partyPopperEmoji = "🎉";
const hostEmoji = "🏠";
class UserBaseInfo{
  constructor(uid,photoURL,displayName,gender,role){
    this.uid = uid
    this.photoURL = photoURL
    this.displayName = displayName
    this.gender = gender
    this.role = role
  }
  isHost(){
    return  role === "HOST"
  }
  isMaster(){
    return role === "MASTER"
  }
}
class DeviceNotificationToken{
  constructor(deviceType,token){
    this.type = deviceType
    this.token = token
  }
}
class SubscribNotificationData{
  constructor(isFollowBack,deviceTokenList,subscriber){
    this.isFollowBack = isFollowBack
    this.deviceTokenList = deviceTokenList
    this.subscriber = subscriber
  }
}
function sendSubscribeNotification(subscribData){
  let androidTokenList = [];
  let iosTokenList = [];
  let huaweiTokenList = [];
  functions.logger.debug(`${subscribData.deviceTokenList.length}`)
  subscribData.deviceTokenList.forEach(element => {
    if (element.type == "ios"){
      iosTokenList.push(element.token)
    }else if (element.type == "android"){
      androidTokenList.push(element.token)
    }else if (element.type == "huawei"){
      huaweiTokenList.push(element.token)
    }
  });

  let subscriberBaseInfo= subscribData.subscriber;
  let subscriberPrefix;
  if (subscriberBaseInfo.role == "HOST"){
    subscriberPrefix = hostEmoji
  }else if(subscriberBaseInfo.role == "MASTER"){
    if (subscriberBaseInfo.gender == "M"){
      subscriberPrefix = maleEmoji
    }else{
      subscriberPrefix = femaleEmoji
    }
  }
  let alertBody;
  if (subscribData.isFollowBack){
    alertBody = `${subscriberPrefix} “${subscribData.subscriber.displayName}” 也关注了你。`;
  }else{
    alertBody = `${subscriberPrefix} “${subscribData.subscriber.displayName}” 关注了你。${partyPopperEmoji}快去“互相关注”${partyPopperEmoji}`;
  }
  let notificationPackage = {
    alert:{
      sound : "default",
      "title": `${friendEmoji} 关注提醒`,
      "body" : alertBody,
      "image": subscribData.subscriber.photoURL,
    },
    data:{
      "type": "subscribe",
      "senderURL": subscribData.subscriber.photoURL,
      "senderUid": subscribData.subscriber.uid,
      "senderDisplayName": subscribData.subscriber.displayName,
      "senderRole": subscribData.subscriber.role
    }
  }
  if (subscribData.subscriber.gender){
    notificationPackage.data['senderGender'] = subscribData.subscriber.gender
  }
    // let notificationData = {
    //   "type": "subscribe",
    //   "title": `${friendEmoji} 关注提醒`,
    //   "body" : `${subscriberPrefix} “${subscribData.subscriber.displayName}” 关注了你。${partyPopperEmoji}点击去“互相关注”${partyPopperEmoji}`,
    //   "senderURL": subscribData.subscriber.photoURL,
    //   "senderUid": subscribData.subscriber.uid,
    // }
  let promiseList = []
  if (androidTokenList.length !== 0){
    promiseList.push(sendMessageToAndroid(androidTokenList,'normal',notificationPackage))
  }
  if (iosTokenList.length !== 0){
    promiseList.push(sendMessageToIOS(iosTokenList,'normal',notificationPackage))
  }
  if (huaweiTokenList.length !== 0){
    promiseList.push(sendMessageToHuawei(huaweiTokenList,'normal',notificationPackage))
  }
  return Promise.all([promiseList])
}
function sendMessageToHuawei(tokenList,priority,notificationData){
  let mc = hcm.messaging().messaging;

  let AndroidConfig = {
      "collapse_key": -1,
      "urgency": "NORMAL",
      // "category": "PLAY_VOICE",
      "ttl": "1448s",
      // "bi_tag": "Trump",
      "fast_app_target": 1,
      "notification": {
          "title":notificationData.alert.title,
          "body": notificationData.alert.body,
          "image": notificationData.alert.image,
          // "icon": "/raw/ic_launcher",
          // "color": "#AACCDD",
          // "sound": "/raw/shake",
          "default_sound": true,
          "importance": priority.toUpperCase(),
          "click_action": {
              "type": 3
              // "intent": "intent://com.huawei.codelabpush/deeplink?#Intent;scheme=pushscheme;launchFlags=0x04000000;i.age=180;S.name=abc;end",
              // "url": "https://www.vmall.com"
          },
          // "buttons": [
          //     {"action_type": 0, "name": "LEARN MORE"},
          //     {"action_type": 3,"name": "IGNORE"}
          // ],   
          // "body_loc_key": "demo_title_new2",
          // "body_loc_args": [
          //     "Boy",
          //     "Dog",
          //     "ff"
          // ],
          // "title_loc_key": "demo_title_new2",
          // "title_loc_args": [
          //     "Girl",
          //     "Cat",
          //     "tiger"
          // ],
          // "channel_id": "HMSTestDemo",
          // "auto_clear": 300000,
          // "notify_summary": "Some Summary",
          "style": 0,
          // "big_title": "the big title",
          // "big_body": "the big body",
          // "notify_id": 486,
          // "group": "Espace",
          "badge": {
              "add_num": 1,
              "class": "com.wjthub.flutter.massage.host.MainActivity"
          },
          "foreground_show": true,
          "ticker": "I am a ticker",
          // "when": "2014-10-02T15:01:23.045123456Z",
          "local_only": false,
          "use_default_vibrate": true,
          "use_default_light": true,
          "visibility": "PUBLIC",
          "vibrate_config": [
              "1",
              "3"
          ],
          "light_settings": {
              "color": {
                  "alpha": 0,
                  "red": 0,
                  "green": 1,
                  "blue": 0.1
              },
              "light_on_duration": "3.5",
              "light_off_duration": "5S"
          }
      }
  }
  let message = {
    // data: notificationData.data,
    android: AndroidConfig,
    token: tokenList
  };    
  return mc.send(message, false)
  // .then(data => {
  //     functions.logger.info(data);
  //     resp.send(data)
  // }).catch(err => {
  //     functions.logger.warn(err);
  //     resp.send(err)
  // });
}
function sendMessageToAndroid(tokenList,priority,notificationData){
  let options = {
    priority: 'high',
    contentAvailable:true
  }
  let fcmNotificationData = {}
  fcmNotificationData = Object.assign(fcmNotificationData,notificationData.alert)
  fcmNotificationData = Object.assign(fcmNotificationData,notificationData.data)
  // return admin.messaging().sendToDevice(tokenList,{notification:notificationData.alert,
    // data:fcmNotificationData},options)
  let  message = {
      token:tokenList[0],
      // notification:notificationData.alert,
      data:notificationData.data,
      android:{
        priority:priority,
        notification:notificationData.alert
        // "default_sound": true,
        // visibility: "public"
      }
    }

  return admin.messaging().send(message)
}
function sendMessageToIOS(tokenList,priority,notificationData){
  let apnsAlert = {}
  apnsAlert = Object.assign(apnsAlert,notificationData.alert)
  let fcm_options = {}
  if (apnsAlert.image != undefined){
    fcm_options.image = notificationData.alert.image;
    delete apnsAlert.image
  }
  let sound = "";
  if (apnsAlert.sound != undefined) {
    sound = apnsAlert.sound
    delete apnsAlert.sound
  }
  if (tokenList.length == 1){
    let message = {
      token:tokenList[0],
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
            'content-available':0,  // should be '0', otherwise Firebase.message.listen will NOT Triggered.
            alert : apnsAlert,
            sound: sound
          }
        },
        fcm_options:fcm_options
      },
      data:notificationData.data,
    }

    return admin.messaging().send(message)
  }else{
    let message = {
      tokens:tokenList,
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
            // 'content-available':0,
            alert : apnsAlert,
            sound: sound
          },
        },
        headers: {
          "apns-push-type": "background",
          "apns-priority": "5", // Must be `5` when `contentAvailable` is set to true.
          // "apns-topic": "io.flutter.plugins.firebase.messaging", // bundle identifier
        },
        fcm_options:fcm_options
      },
      data:notificationData.data,
    }

    return admin.messaging().sendMulticast(message)
  }

}

exports.onSubscribeCreated = functions.firestore
  .document('Subscribe/{userGUID}/FollowedList/{friendsGUID}')
  .onCreate((change,context)=>{
    var requestUserGUID = context.params.userGUID;
    var relationshipGUID = context.params.relationshipGUID
    var friendsGUID =  context.params.friendsGUID
    functions.logger.info(`Trigger: UserGUID:"${requestUserGUID}" create relationshipGUID:"${relationshipGUID}" with otherUserGUID:"${friendsGUID}"`, {structuredData: true});
    functions.logger.debug(`find otherUser by uid.`)
    functions.logger.info(`add request ueser to otherUser's followerList success.`)

    // 1. get two users' base info from db
    Promise.all([
      userCollection.doc(requestUserGUID).get(),
      userCollection.doc(friendsGUID).get()
    ])
    .then(userSnapshot=>{
      let requestUserSnapshot= userSnapshot[0]
      let otherUserSnapshot= userSnapshot[1]
      if (!requestUserSnapshot.exists){
        functions.logger.error("request user not found from Users Collection")
        return Promise.reject("request user not exists")
      }
      if (!otherUserSnapshot.exists){
        functions.logger.error("other user not found from Users Collection")
        return Promise.reject("other user not exists")
      }
      let requestUser = userSnapshot[0].data()
      let otherUser= userSnapshot[1].data()
      
      functions.logger.info("add users' BaseInfo to 'FollowerList' and 'FollowedList'.")
      return Promise.all([
        Promise.resolve(requestUser),
        SubscribeListCollections.doc(friendsGUID).collection("FollowerList").doc(requestUserGUID).set({
            subscribedAt: new Date().toISOString(),
            baseInfo: {
              role: requestUser.role,
              uid: requestUserGUID,
              displayName: requestUser.displayName,
              alphabetName: requestUser.alphabetName
            }
        }),
        SubscribeListCollections.doc(requestUserGUID).collection("FollowedList").doc(friendsGUID).update({
          baseInfo: {
            uid: friendsGUID,
            role: otherUser.role,
            displayName: otherUser.displayName,
            alphabetName: otherUser.alphabetName
          }
        })
      ])
    })
    .then(res=>{
      functions.logger.info(`notify otherUser has a new follower.`)
      return Promise.all([
        
        Promise.resolve(res[0]),
        OnlineInfoCollections.doc(friendsGUID).get(),
        SubscribeListCollections.doc(friendsGUID).collection("FollowedList").doc(requestUserGUID).get(),
      ])
    })
    .then(snapshotList=>{
      let otherUserOnlineInfoSnapshot = snapshotList[1];
      let inOtherUserFollowedListSnapshot = snapshotList[2];
      if (!otherUserOnlineInfoSnapshot.exists){
        return Promise.reject("other user's online state not exists.")
      }
      if (inOtherUserFollowedListSnapshot.exists){
        functions.logger.debug("requestUser already in otherUser's 'FollowedList', assert current subscribe is 'FollowBack'.")
      }
      let requestUserBaseInfo = snapshotList[0]
      let receiverOnlineInfo = otherUserOnlineInfoSnapshot.data();

      let deviceType = receiverOnlineInfo.deviceType;
      let deviceTokenStr;
      if (deviceType == "huawei"){
        deviceTokenStr = receiverOnlineInfo.notifiyTokenList.first(e=>e.type == "hcm").token
        // deviceTokenStr = receiverOnlineInfo.token.hcm
      }else{
        deviceTokenStr = receiverOnlineInfo.notifiyTokenList.first(e=>e.type == "fcm").token
        // deviceTokenStr = receiverOnlineInfo.token.fcm
      }

      let senderUserInfo = new UserBaseInfo(
          requestUserGUID,
          requestUserBaseInfo.photoURL,
          requestUserBaseInfo.displayName,
          requestUserBaseInfo.gender,
          requestUserBaseInfo.role
      ); 
      if (senderUserInfo.role === 'master'){
        senderUserInfo.gender = requestUserBaseInfo.gender
      }
      let subscribeNotification = new SubscribNotificationData(
        inOtherUserFollowedListSnapshot,
        [new DeviceNotificationToken(receiverOnlineInfo.deviceType, deviceTokenStr)],
        senderUserInfo
      )
      functions.logger.debug(`send data:${JSON.stringify(requestUserGUID)} to ${deviceType}:${deviceTokenStr}`);
      return sendSubscribeNotification(subscribeNotification);
    })
    .then(res=>{
      functions.logger.debug(`send notification with result: "${JSON.stringify(res)}"`);
      functions.logger.info(`Trigger_onSubscribeCreated success.`, {structuredData: true})
    })
    .catch(reason=>{
      functions.logger.warn(`Trigger_onSubscribeCreated: failed: ${reason}`)
    })
})
exports.onSubscribeWrited = functions.firestore
  .document('Friends/ok')
  .onWrite((change,context)=>{
    functions.logger.info(`Trigger onWrite: UserGUID:"${context.params.userGUID}".`, {structuredData: true});
})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// assign notification timeout
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const OrderAssignNotificationHandler = require("./handlers/order_assign_notification.handler");
const OrderAssignNotification = require("./models/OrderAssignNotification");


var db = admin.database();
var ref = db.ref("OrderAssign/")

ref.on("value",function(snapshot){
  // console.log(`realtime-datanase: 'on value' new value ${snapshot.val()}`)
  functions.logger.info(`realtime-datanase: 'on value' new value ${snapshot.exists()}`)
  if (snapshot.exists()){
    functions.logger.info(`realtime-database: 'on value' snapshot: ${JSON.stringify(snapshot.val())}`)
    // snapshot key is orderGuid
    var orderSnapshot = Object.values(snapshot.val())[0];
    // snapshot key is assignGuid
    var assignSnapsho = Object.values(orderSnapshot)[0];
    functions.logger.info(`realtime-database: 'on value' snapshot: ${JSON.stringify(assignSnapsho)}.`)
    OrderAssignNotificationHandler.NewOrderAssignNotificationAdded(OrderAssignNotification.fromJson(assignSnapsho))
  }else{
    functions.logger.info(`realtime-database: 'on value' to null.`)
  }
})


// ref.on("child_added",(snapshot,previousChildKey)=>{
//     var orderGuid = snapshot.key;
//     console.log(`realtime-database`)
//     functions.logger.info(`realtime-database: 'child_added'.`)
//     if (snapshot.exists()){
//       functions.logger.info(`realtime-database: 'child_added' snapshot: ${JSON.stringify(Object.values(snapshot.val())[0])}.`)
//       var notification = OrderAssignNotification.fromJson(Object.values(snapshot.val())[0]);
//       functions.logger.debug(`notification assign order: ${JSON.stringify(notification)}`);
//       OrderAssignNotificationHandler.NewOrderAssignNotificationAdded(notification)
//     }
//   functions.logger.info(`realtime-datanase: 'OrderAssign/' new ${JSON.stringify(snapshot)}`)
// })


//TODO: dev only
exports.assign = functions.https.onRequest(async (req,resp)=>{
  // var masterUid = req.query.device == "android"
  masterUid=req.query.uid
  var testJsonData = {
    "orderGuid":"6fd64c43-41f5-4654-958b-f31e5f31f1b3",
    "serviceGuid":"b53d8d81-91f6-4d35-a075-7f68702304ef",
    "assignState":"Assigning",
    "masterUid":masterUid,
    "totalServiceNumber":1,
    "assignGuid":"a5fd2cb6-7808-45ee-a1d3-47d26ca80293",
    "assignTimeoutSeconds":20,
    "orderState":"Creating",
    "orderCreatedAt":"2022-03-29T18:51:57.077171",
    "assignAt":"2022-03-30T16:11:19.587292",
    "totalServiceMinutes":60,
    "hostBaseInfo":{
      "photoURL":"http://192.168.0.64:9199/download/storage/v1/b/massage-o2o-dev.appspot.com/o/headprofile%2F9XMr01fAbx5qMmutgYHsg4ntrGJ0.jpg?generation=1648604580607&alt=media",
      "uid":"9XMr01fAbx5qMmutgYHsg4ntrGJ0",
      "displayName":"超凡按摩"
    }
  }
    try{
      var res = await OrderAssignNotificationHandler.NewOrderAssignNotificationAdded(OrderAssignNotification.fromJson(testJsonData))
      resp.send(res)
    } catch (e){
      resp.send(e)
    }
})