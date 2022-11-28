
const assert = require("assert");
const expect = require("chai").expect;

const {UserCollection,OnlineMastersCollection} = require("../../database/firebase.database");


describe("test add locations", async ()=>{
    it("master",async()=>{
        let querySnap = await UserCollection.where("role","==","MASTER").get();
        // UserCollection.where("role","==","MASTER").get().then((querySnap)=>{
            // console.log(`!----------- ${querySnap.size} masters found -----------`); 
        // });
        console.log(`----------- ${querySnap.size} masters found -----------`);
        if (!querySnap.empty){
            let masters = querySnap.docs.map(doc=>doc.data());
            let now = new Date();
            let fakeMasterLocations = [{"uuid": "0DJ8HWy983de1fdh787vtXPTIl48", "geometry": {"lng": -114.9265652, "lat": 36.1113666}}, 
            {"uuid": "0aavxtXDiDc0aXqfVAQFT6fcgoP2", "geometry": {"lng": -115.2748137, "lat": 36.1734999}}, 
            {"uuid": "5bKXBUOoljp2NamUDzRDJwpJ2RDn", "geometry": {"lng": -115.2781989, "lat": 36.0169618}}, 
            {"uuid": "5ygQAAibms6RDjR0Dbt8VQMGXxjt", "geometry": {"lng": -115.2386335, "lat": 36.053021}}, 
            {"uuid": "7qOod0gBHuGuN7bZeXfikljBPcta", "geometry": {"lng": -115.1506446, "lat": 36.2779169}}, 
            {"uuid": "8miEZ7U29Qc17sqx9x9NW47943Uy", "geometry": {"lng": -115.2160545, "lat": 36.1695332}}, 
            {"uuid": "8z6L4IvGnWafoUXGxGwaJ0VrCJ8U", "geometry": {"lng": -115.2917972, "lat": 36.2861371}}, 
            {"uuid": "9wpjzAcONapr0ZvDqjVXfWXHJX0k", "geometry": {"lng": -115.3735527, "lat": 36.1717681}}, 
            {"uuid": "9yHe2xU067A3fTOc6bfEHYcuhbQF", "geometry": {"lng": -115.0784811, "lat": 35.9701512}}, 
            {"uuid": "AlcQcL741XY33PuRFN5vDkNrCLHr", "geometry": {"lng": -115.0569387, "lat": 36.1240563}}, 
            {"uuid": "FXzoDAmCJl5ESKESrrdXRQOGbXhE", "geometry": {"lng": -115.0854113, "lat": 35.9456986}}, 
            {"uuid": "H3WTBgvpWietnlMI3W3ODt7AIUVj", "geometry": {"lng": -115.0759448, "lat": 36.1328019}}, 
            {"uuid": "HR08qBEAB2EPgUgpwzmm19bLhW17", "geometry": {"lng": -115.2145186, "lat": 36.2468569}}, 
            {"uuid": "KhiDxsw0CIlKegoKpdBXJt5lkLde", "geometry": {"lng": -115.3186882, "lat": 36.166153}}, 
            {"uuid": "MU2wo2mJLwcklpwEaFsqYWpdpp0l", "geometry": {"lng": -115.1251538, "lat": 36.14506}}, 
            {"uuid": "NDuCQPami4UlqUGvMjl0Vi1tp7NB", "geometry": {"lng": -115.1446871, "lat": 36.156903}}, 
            {"uuid": "NGxGsbTKAAydM93eKPR5ZiKL5OhE", "geometry": {"lng": -115.3246836, "lat": 36.302578}}, 
            {"uuid": "OSRnGszyt9JIukKYweGzN92coqEc", "geometry": {"lng": -115.1582054, "lat": 36.2129033}}, 
            {"uuid": "U3ZYichjQDgxuYPyFxbUMwk8c3lO", "geometry": {"lng": -115.302229, "lat": 36.0667593}}, 
            {"uuid": "UiNBoeUkgHZozwLaKgv8Hik5SH6P", "geometry": {"lng": -115.2207289, "lat": 36.242826}}, 
            {"uuid": "VXUeqFugLHjKRcKSh9imO2jjnDle", "geometry": {"lng": -115.1306953, "lat": 36.0432335}}, 
            {"uuid": "WY7KYDcNVUuIyq50kt30Lr0LD5wX", "geometry": {"lng": -115.3261472, "lat": 36.1893996}}, 
            {"uuid": "aNhZh2DlwtYg2JQrKOKg0rFJLKVn", "geometry": {"lng": -115.2347508, "lat": 36.2594687}}, 
            {"uuid": "d5qKEywcPsEUCwIn988zjD28T48p", "geometry": {"lng": -115.123938, "lat": 36.1716744}}, 
            {"uuid": "eeuNyv03nHAN00dEeK7pstPpXeZa", "geometry": {"lng": -115.2633024, "lat": 36.1201071}}, 
            {"uuid": "fkfU3dJ0ajbzltyeNZ1tHF9WH8IZ", "geometry": {"lng": -115.1854923, "lat": 35.9900178}}, 
            {"uuid": "frLimsHsKHM88Xkv42aETStD0dPJ", "geometry": {"lng": -115.2619943, "lat": 36.2739812}}, 
            {"uuid": "g9w3bA1BSk00bW3AjdZKaEcqmMNd", "geometry": {"lng": -115.101435, "lat": 36.0083893}}, 
            {"uuid": "hDANDCVOJsOJjlzdQL9jbcJ3j2ay", "geometry": {"lng": -115.07423, "lat": 36.1286723}}, 
            {"uuid": "hbMPSr4nVNMjoN7KI5zIZ9LnW6ES", "geometry": {"lng": -114.9667707, "lat": 36.0316608}}, 
            {"uuid": "hfkcvBG4sr4bE4Wu5yLJlKfyD9mf", "geometry": {"lng": -115.3404332, "lat": 36.2112508}}, 
            {"uuid": "iRVFEcszRidRsLSlhKQwZPSMgvSr", "geometry": {"lng": -115.1603719, "lat": 36.1809166}}, 
            {"uuid": "k6VydH6Zl1tTZNhvnWu2SiQPWRp2", "geometry": {"lng": -115.1108085, "lat": 36.0995368}}, 
            {"uuid": "kSIZ6WtjAhkH2YFyZXYFfKfAkfLm", "geometry": {"lng": -115.4347078, "lat": 35.8320554}}, 
            {"uuid": "m3FrC4VxgXdTF4OKqtrsjrAs8r5b", "geometry": {"lng": -115.1384323, "lat": 36.0273019}}, 
            {"uuid": "p07i6c9ayM9f8XtbshFp7ThAwFkn", "geometry": {"lng": -115.329547, "lat": 36.2270363}}, 
            {"uuid": "pVAyAsftIpKSqPK2aNolPjYGJlcl", "geometry": {"lng": -115.0286943, "lat": 36.0880103}}, 
            {"uuid": "sQBbzOBHrP4pp3OI4cZX8D9orfTn", "geometry": {"lng": -115.1496569, "lat": 35.9908365}}, 
            {"uuid": "scajv3POpmskPPRFEgJ23U16Vxej", "geometry": {"lng": -115.1890997, "lat": 36.2369242}}, 
            {"uuid": "sy52Z2xjRfZPQ4aX5fEsnc7qP59V", "geometry": {"lng": -115.1362384, "lat": 36.0105765}}, 
            {"uuid": "teStlStRRJbzI9bYsXfYzaSGeJaK", "geometry": {"lng": -115.1207811, "lat": 36.0062507}}, 
            {"uuid": "vwA1k8oua2poSxelYCopCq1Zdp4z", "geometry": {"lng": -115.2012102, "lat": 36.1403035}}, 
            {"uuid": "wVkgh738PDjRAeyQyIVhh4tZp1SH", "geometry": {"lng": -115.0825832, "lat": 36.1603708}}, 
            {"uuid": "yJG1haoMQXtOXfO9R7Ub0GHBgR3W", "geometry": {"lng": -115.2767392, "lat": 36.0215391}}, 
            {"uuid": "zITxaQsYkU7OeXTM2D9BEMx2WtaR", "geometry": {"lng": -115.0778282, "lat": 36.0142986}}]
        
            let onlineMasterInfoList = masters.map(master=>{
                const geometry = fakeMasterLocations.find(fakeMaster=>fakeMaster.uuid===master.uuid)['geometry'];
                return {
                    baseInfo: master,
                    lastLoginAt: now.toISOString(),
                    onlineStatus: "ONLINE",
                    uid: master.uid,
                    location: {
                        latitiude: geometry.lat,
                        longitude: geometry.lng
                    }
                }
            });
            console.log(onlineMasterInfoList.length);
            for (let onlineMasterInfo in onlineMasterInfoList) {
                await OnlineMastersCollection.doc(onlineMasterInfo.uid).set(onlineMasterInfo);
            }
        }
    });
    // it("AssignStateEnum from string to enum",()=>{
    //     expect(AssignStateEnum["Preparing"]).to.equal(AssignStateEnum.Preparing);
    // });
})