const {MasterStateSketchAppointmentModel} = require("../../models/master_state_sketch.model");
const ServiceModel = require("../../models/service.model");
const {addNewAppointment} = require("../../services/master_state_sketch.service");

const {describe,it} = require('mocha');
const {expect} = require('chai');

const ServiceStateEnum = require('../../models/service_state.enum').ServiceStateEnum;

describe('addNewAppointment by ServiceModel.service', ()=>{
    const createdAt = new Date()
    const appointmentStartAt = new Date(createdAt.getTime() + 1000*60*60);
    const totalServiceMinutes = 90
    const appointmentEndAt = new Date(appointmentStartAt + 1000*60*totalServiceMinutes)
    const updatedToWaitingServiceModel = new ServiceModel(
        "updatedToWaitingServiceModel_guid",
        "updatedToWaitingServiceModel_orderGuid",
        1,
        "updatedToWaitingServiceModel_creatorUid",
        ServiceStateEnum.Waiting,
        createdAt,
        -1,
        null,
        "updatedToWaitingServiceModel_assignedMasterUid",
        totalServiceMinutes,
        null,
        null,
        null,
        "updatedToWaitingServiceModel_assignGuid",
        null,
        null,
        appointmentEndAt,
        null,
        null,
        appointmentStartAt,
        null,
    );
    it ("addNewAppointment by ServiceModel.service", ()=>{

    });
});