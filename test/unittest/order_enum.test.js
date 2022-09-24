const assert = require("assert");
const expect = require("chai").expect;
const OrderStatusEnum = require("../models/order.enum").OrderStatusEnum;

describe("test OrderStatusEnum", function(){
    it("OrderStatusEnum toString got key as string value",()=>{
        expect(OrderStatusEnum.None.toString()).to.equal("None");
    });
    it("OrderStatusEnum from string to enum",()=>{
        expect(OrderStatusEnum["None"]).to.equal(OrderStatusEnum.None);
    });
})