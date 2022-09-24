const assert = require("assert");
const expect = require("chai").expect;
const AssignStateEnum = require("../../models/assign.enum").AssignStateEnum;

describe("test AssignStateEnum", function(){
    it("AssignStateEnum toString got key as string value",()=>{
        expect(AssignStateEnum.Preparing.toString()).to.equal("Preparing");
    });
    it("AssignStateEnum from string to enum",()=>{
        expect(AssignStateEnum["Preparing"]).to.equal(AssignStateEnum.Preparing);
    });
})