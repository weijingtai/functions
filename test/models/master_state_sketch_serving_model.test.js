const {MasterStateSketchServingModel} = require("../../models/master_state_sketch.model");

const {describe,it} = require('mocha');
const {expect} = require('chai');


describe("test MasterStateSketchServingModel Model fromJSON&toJSON", ()=>{
    it("not changed after 'ser&des'",()=>{
        const servingModel = new MasterStateSketchServingModel(
            "MasterStateSketchServingModel",
            "MasterStateSketchServingModel_storeUid",
            "MasterStateSketchServingModel_orderUid",
            "MasterStateSketchServingModel_serviceUid",
            new Date(),
            null, // previsousAt
            new Date(new Date().getTime()+ 60 * 60000), // endAt is 'null' means not start yet
            60, // serviceDurationMinutes
            null, // lastModifiedAt, 'null' means not modified
            null, // canceledAt, 'null' means not canceled
            new Date(), // createdAt
            [45,-30], // addSubMinutes 'null' means not modified
            null , // resetAt 'null' means not reset
            -1, // completedSeconds '-1' means not started
        )
        let jsonServing = servingModel.toJson();
        
        console.log(JSON.stringify(jsonServing));
        let servingModel2 = MasterStateSketchServingModel.fromJson(jsonServing);
        expect(servingModel).to.deep.equal(servingModel2);
    });
    it ("test des from dart jsonData with 'endAt'",()=>{
        const dartJSON = {"type":"Serving","guid":"ServingServiceBaseModel_guid","startAt":"2022-11-30T02:18:50.044Z","endAt":"2022-11-30T03:48:50.044Z","createdAt":"2022-11-30T02:18:50.044Z","storeUid":"ServingServiceBaseModel_storeUid","orderUid":"ServingServiceBaseModel_orderUid","serviceUid":"ServingServiceBaseModel_serviceUid","serviceDurationMinutes":90,"completedSeconds":0};
        let servingModel2 = MasterStateSketchServingModel.fromJson(dartJSON);
        expect(servingModel2.endAt).to.not.equal(null);
        expect(servingModel2.toJson()).to.deep.equal(dartJSON);
    })
    it("test des from dart jsonData",()=>{
        const dartJson = {"type":"Serving","guid":"ServingServiceBaseModel_guid","startAt":"2022-11-30T02:18:50.033Z","createdAt":"2022-11-30T02:18:50.033Z","storeUid":"ServingServiceBaseModel_storeUid","orderUid":"ServingServiceBaseModel_orderUid","serviceUid":"ServingServiceBaseModel_serviceUid","serviceDurationMinutes":90,"completedSeconds":0}
        let servingModel2 = MasterStateSketchServingModel.fromJson(dartJson);
        expect(servingModel2).to.be.an.instanceof(MasterStateSketchServingModel);
        expect(servingModel2.toJson()).to.deep.equal(dartJson);
    });
    it("test des from dart jsonData with 'addSubMinutes'",()=>{
        const dartJson = {"type":"Serving","guid":"ServingServiceBaseModel_guid","startAt":"2022-11-30T02:26:44.041Z","addSubMinutes":[-30,60],"createdAt":"2022-11-30T02:26:44.041Z","storeUid":"ServingServiceBaseModel_storeUid","orderUid":"ServingServiceBaseModel_orderUid","serviceUid":"ServingServiceBaseModel_serviceUid","serviceDurationMinutes":90,"completedSeconds":-1};
        let servingModel2 = MasterStateSketchServingModel.fromJson(dartJson);
        expect(servingModel2).to.be.an.instanceof(MasterStateSketchServingModel);
        expect(servingModel2.toJson()).to.deep.equal(dartJson);
        expect(servingModel2.addSubMinutes).to.deep.equal([-30,60]);

    });
})