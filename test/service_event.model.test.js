var {AcceptAssignServiceEvent,BaseAssignServiceEvent} = require("../models/service_event.model")
const {AssignEventEnum} = require("../models/assign.enum")
const assert = require("assert");
const expect = require("chai").expect;

describe("BaseAssignServiceEvent",()=>{
    it ("should be a function",()=>{
        var now = new Date();
        var event = new BaseAssignServiceEvent(
            "03dc46c8-0564-4961-8ce4-9669092baec3",
            "5e905d80-a20e-4f0f-8ee4-60819713b48e",
            "WiqoPCGiF4uw7K3m84xSG6gZZpzG",
            "WiqoPCGiF4uw7K3m84xSG6gZZpzG",
            now,
            "5e905d80-a20e-4f0f-8ee4-60819713b481",
            AssignEventEnum.Assign
          )
        var resultObject = event.toJson();
        // expect(resultObject["operatedAt"] ==  now.toISOString()).to.be.true;
        // expect(resultObject["assignEvent"] == AssignEventEnum.Assign).to.be.true;
        expect(resultObject["assignEvent"] == "Assign").to.be.true;

    });

});
describe("AcceptAssignServiceEvent", function(){
    it("serial from jsonData",()=>{
        var now = new Date();
        var event = new AcceptAssignServiceEvent(
            "03dc46c8-0564-4961-8ce4-9669092baec3",
            "5e905d80-a20e-4f0f-8ee4-60819713b48e",
            "WiqoPCGiF4uw7K3m84xSG6gZZpzG",
            "WiqoPCGiF4uw7K3m84xSG6gZZpzG",
            now,
            "5e905d80-a20e-4f0f-8ee4-60819713b481",
          )
        var resultObject = event.toJson();
      expect(resultObject["operatedAt"] ==  now.toISOString()).to.be.true;
      expect(resultObject["assignGuid"] ==  "5e905d80-a20e-4f0f-8ee4-60819713b481").to.be.true;
      expect(resultObject["assignEvent"] == "Accept").to.be.true;
    });
  
});
describe("AcceptAssignServiceEvent", function(){
})