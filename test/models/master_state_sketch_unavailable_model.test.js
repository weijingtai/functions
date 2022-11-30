const {MasterStateSketchUnavailableModel} = require("../../models/master_state_sketch.model");

const {describe,it} = require('mocha');
const {expect} = require('chai');


describe("test MasterStateSketchUnavailableModel Model fromJSON&toJSON", ()=>{
    it("not changed after 'ser&des'",()=>{
        const model = new MasterStateSketchUnavailableModel(
            "MasterStateSketchUnavailableModel",
            new Date(), // startAt
            null, // previsousAt is 'null' means not start yet
            new Date(new Date().getTime() + 60*60000),// endAt should required with appointmentModel
            new Date(), // createdAt
            null, // canceledAt, 'null' means not canceled
            null, // lastModifiedAt, 'null' means not modified
            null, // addSubMinutes 'null' means not modified
        )
        let jsonModel = model.toJson();
        let model2 = MasterStateSketchUnavailableModel.fromJson(jsonModel);
        expect(model).to.deep.equal(model2);
    });
})