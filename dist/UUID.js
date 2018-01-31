"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leftPad = require("left-pad");
var uuidV1 = require("uuid/v1");
var uuidV4 = require("uuid/v4");
var uuidV5 = require("uuid/v5");
var UUIDError_1 = require("./UUIDError");
var BYTES_32BIT = 4;
var BYTES_16BIT = 2;
var INT128_32BIT_WORDS = 4;
var BYTES_128BIT = INT128_32BIT_WORDS * BYTES_32BIT;
var CHARS_HEX_BYTE = 2;
var HEX_BASE = 16;
var HEX_STR_32BIT_LEN = BYTES_32BIT * CHARS_HEX_BYTE;
var HEX_STR_16BIT_LEN = BYTES_16BIT * CHARS_HEX_BYTE;
var UUID_STRING_LENGTH = BYTES_128BIT * CHARS_HEX_BYTE;
var UUID = /** @class */ (function () {
    function UUID(uuid) {
        if (typeof uuid === "undefined") {
            this.data = new Uint32Array(INT128_32BIT_WORDS);
        }
        else if (uuid instanceof Uint32Array) {
            this.data = new Uint32Array(INT128_32BIT_WORDS);
            this.data.set(uuid);
        }
        else if (uuid instanceof Uint8Array) {
            if (uuid.length !== BYTES_128BIT) {
                throw new UUIDError_1.UUIDError("Cannot construct UUID from Uint8Array unless the length is " + BYTES_128BIT + " byes");
            }
            this.data = new Uint32Array(uuid);
        }
        else if (uuid instanceof UUID && typeof uuid !== "string") {
            this.data = new Uint32Array(INT128_32BIT_WORDS);
            this.data.set(uuid.data);
        }
        else if (typeof uuid === "string") {
            this.data = UUID.parseString(uuid);
        }
        else {
            throw new UUIDError_1.UUIDError("Cannot construct UUID from unsupported data type");
        }
    }
    UUID.prototype.toString = function () {
        return UUID.toString(this);
    };
    UUID.v1 = function (options) {
        var tempBuffer = new Uint8Array(BYTES_128BIT);
        uuidV1(options, tempBuffer);
        var uuid = new UUID(tempBuffer);
        return uuid;
    };
    UUID.v4 = function (options) {
        var tempBuffer = new Uint8Array(BYTES_128BIT);
        uuidV4(undefined, tempBuffer);
        var uuid = new UUID(tempBuffer);
        return uuid;
    };
    UUID.v5 = function (name, namespace) {
        var tempBuffer = new Uint8Array(BYTES_128BIT);
        uuidV5(name, namespace, tempBuffer);
        var uuid = new UUID(tempBuffer);
        return uuid;
    };
    UUID.toString = function (uuid) {
        var parts = [
            uuid.data[0].toString(HEX_BASE),
            uuid.data[1].toString(HEX_BASE),
            uuid.data[2].toString(HEX_BASE),
            uuid.data[3].toString(HEX_BASE),
        ].map(function (v) { return leftPad(v, HEX_STR_32BIT_LEN, "0"); });
        var hexEndPos1 = HEX_STR_16BIT_LEN;
        var hexEndPos2 = hexEndPos1 + HEX_STR_16BIT_LEN;
        var str = (parts[0] + "-" +
            parts[1].slice(0, hexEndPos1) + "-" + parts[1].slice(hexEndPos1, hexEndPos2) + "-" +
            parts[2].slice(0, hexEndPos1) + "-" + parts[2].slice(hexEndPos1, hexEndPos2) +
            parts[3]);
        return str;
    };
    UUID.parseString = function (str) {
        str = str.replace(/[-{}]/g, "");
        if (str.length !== UUID_STRING_LENGTH) {
            throw new UUIDError_1.UUIDError("Unable to parse UUID from string");
        }
        var ret = new Uint32Array(INT128_32BIT_WORDS);
        for (var i = 0; i < INT128_32BIT_WORDS; i++) {
            var startPos = i * HEX_STR_32BIT_LEN;
            ret[i] = parseInt(str.slice(startPos, startPos + HEX_STR_32BIT_LEN), HEX_BASE);
        }
        return ret;
    };
    return UUID;
}());
exports.UUID = UUID;
