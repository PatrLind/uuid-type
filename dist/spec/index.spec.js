"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var index_1 = require("../index");
describe("UUID Tests", function () {
    it("string -> UUID -> string", function () {
        var uuidStrings = [
            "00112233-4455-6677-8899-aabbccddeeff",
            "ffeeddcc-bbaa-9988-7766-445533221100",
            "140d2079-38eb-421a-a55b-e00dd997643f",
            "0c757036-922c-409e-8808-54a6696a8bb6",
            "60fbd802-f836-46d7-92b3-4dfb6f0ce8cf",
            "ecb129cb-8a38-494e-95eb-fae984ec2424",
        ];
        uuidStrings.forEach(function (uuidStr) {
            var uuid = new index_1.UUID(uuidStr);
            chai_1.expect(uuid.toString()).to.equal(uuidStr);
        });
    });
});
