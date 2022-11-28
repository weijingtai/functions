const { MasterUserGenderEnum } = require("../../models/user.enum");
const MasterBaseInfo = require("../../models/master_base_info.model");

const {describe,it} = require('mocha');
const {expect} = require('chai');

describe("test MasterBaseInfo Model fromJSON&toJSON", ()=>{
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
        var jsonStr = JSON.stringify(masterBaseInfo.toJSON());
        var newMasterBaseInfo = MasterBaseInfo.fromJSON(JSON.parse(jsonStr));
        expect(newMasterBaseInfo).to.deep.equal(masterBaseInfo);
    });
})