const {MasterStateSketchAppointmentModel} = require("../../models/master_state_sketch.model");

const {describe,it} = require('mocha');
const {expect} = require('chai');


describe("test MasterStateSketchAppointmentModel Model fromJSON&toJSON", ()=>{
    it("not changed after 'ser&des'",()=>{
        const appointmentModel = new MasterStateSketchAppointmentModel(
            "MasterStateSketchAppointmentModel",
            "MasterStateSketchAppointmentModel_storeUid",
            "MMasterStateSketchAppointmentModel_orderUid",
            "MasterStateSketchAppointmentModel_serviceUid",
            new Date(), // startAt
            null, // previsousAt is 'null' means not start yet
            new Date(new Date().getTime() + 60*60000),// endAt should required with appointmentModel
            60, // serviceDurationMinutes
            null, // lastModifiedAt, 'null' means not modified
            null, // canceledAt, 'null' means not canceled
            new Date(), // createdAt
            null, // addSubMinutes 'null' means not modified
        )
        let jsonServing = appointmentModel.toJson();
        let appointmentModel2 = MasterStateSketchAppointmentModel.fromJson(jsonServing);
        expect(appointmentModel).to.deep.equal(appointmentModel2);
    });
})