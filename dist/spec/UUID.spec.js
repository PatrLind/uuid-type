"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var uuidV4 = require("uuid/v4");
var index_1 = require("../index");
// tslint:disable:no-var-requires
var bytesToUuid = require("uuid/lib/bytesToUuid");
describe("UUID Tests", function () {
    it("should be able to convert string -> UUID -> string", function () {
        var uuidStrings = [
            "00112233-4455-6677-8899-aabbccddeeff",
            "ffeeddcc-bbaa-9988-7766-445533221100",
            "140d2079-38eb-421a-a55b-e00dd997643f",
            "0c757036-922c-409e-8808-54a6696a8bb6",
            "60fbd802-f836-46d7-92b3-4dfb6f0ce8cf",
            "ecb129cb-8a38-494e-95eb-fae984ec2424",
            "00000000-0000-0000-0000-000000000000",
        ];
        uuidStrings.forEach(function (uuidStr) {
            var uuid = new index_1.UUID(uuidStr);
            chai_1.expect(uuid.toString()).to.equal(uuidStr);
        });
    });
    it("should have the same string representation as the uuid module", function () {
        var uuidData = [
            "00112233445566778899aabbccddeeff",
            "ffeeddccbbaa99887766445533221100",
            "140d207938eb421aa55be00dd997643f",
            "0c757036922c409e880854a6696a8bb6",
            "60fbd802f83646d792b34dfb6f0ce8cf",
            "ecb129cb8a38494e95ebfae984ec2424",
            "00000000000000000000000000000000",
        ];
        var uuidDataBytes = uuidData.map(function (v) {
            var byteCount = 16;
            var buffer = new Array(byteCount);
            for (var i = 0; i < byteCount; i++) {
                buffer[i] = parseInt(v.substr(i * 2, 2), 16);
            }
            return buffer;
        });
        var targetBuf = new Uint8Array(16);
        var uuidValues = uuidDataBytes.map(function (v) {
            var buffer = new Uint8Array(16);
            uuidV4({ random: v }, buffer);
            return { uuid: new index_1.UUID(buffer), buffer: buffer };
        });
        uuidValues.forEach(function (v) {
            console.log(v.uuid.toString(), v.buffer);
            chai_1.expect(v.uuid.toString()).to.equal(bytesToUuid(v.buffer));
        });
    });
});
