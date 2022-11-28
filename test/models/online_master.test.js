const { OnlineStatusEnum } = require("../../models/online_status.enum");
const {MasterUserGenderEnum} = require("../../models/user.enum");
const MasterBaseInfo = require("../../models/master_base_info.model");
const MasterLocationInfo = require("../../models/master_location_info.model");
const OnlineMaster = require("../../models/online_master.model");

const {describe,it} = require('mocha');
const {expect} = require('chai');
const Position = require("../../models/position.model");

describe("test OnlineMaster Model fromJSON&toJSON", ()=>{
    it("not changed after 'ser&des'",()=>{
        const masterBaseInfo = new MasterBaseInfo(
            "uid",
            "username",
            "photoURL",
            "phoneNumber",
            "displayName",
            "alphabetName",
            MasterUserGenderEnum.M
        )
        const masterLocationInfo = new MasterLocationInfo(
            Position.fromJSON({
                "longitude": -115.19496514488269,
                "latitude": 36.12451149343901,
                "timestamp": 1664494865000,
                "accuracy": 6.408452207847068,
                "altitude": 662.2188934152946,
                "floor": null,
                "heading": -1.0,
                "speed": 0.0,
                "speed_accuracy": 0.39119889132890806,
                "is_mocked": false
            })
        )
        let now = new Date();
        const onlineMaster = new OnlineMaster(
            "uid",
            masterBaseInfo,
            now,
            now,
            OnlineStatusEnum.ONLINE,
            masterLocationInfo
        )
        var jsonObj = onlineMaster.toJSON();
        // regex for ISO date string
        var regex = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$");
        // check jsonObj.lastLoginAt is ISO date string
        expect(regex.test(jsonObj.lastLoginAt)).to.be.true;
        var jsonStr = JSON.stringify(jsonObj);
        var newOnlineMaster = OnlineMaster.fromJSON(JSON.parse(jsonStr));
        expect(onlineMaster).to.deep.equal(newOnlineMaster);
    });
})