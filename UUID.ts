import leftPad = require("left-pad");
import { V1Options, V4Options } from "uuid/interfaces";
import * as uuidV1 from "uuid/v1";
import * as uuidV4 from "uuid/v4";
import * as uuidV5 from "uuid/v5";
import { UUIDError } from "./UUIDError";

const BYTES_32BIT = 4;
const BYTES_16BIT = 2;
const INT128_32BIT_WORDS = 4;
const BYTES_128BIT = INT128_32BIT_WORDS * BYTES_32BIT;
const CHARS_HEX_BYTE = 2;
const HEX_BASE = 16;
const HEX_STR_32BIT_LEN = BYTES_32BIT * CHARS_HEX_BYTE;
const HEX_STR_16BIT_LEN = BYTES_16BIT * CHARS_HEX_BYTE;
const UUID_STRING_LENGTH = BYTES_128BIT * CHARS_HEX_BYTE;

export class UUID {
  public readonly data: Uint32Array;

  constructor(uuid?: UUID | string | Uint32Array | Uint8Array) {
    if (typeof uuid === "undefined") {
      this.data = new Uint32Array(INT128_32BIT_WORDS);
    } else if (uuid instanceof Uint32Array) {
      this.data = new Uint32Array(INT128_32BIT_WORDS);
      this.data.set(uuid);
    }  else if (uuid instanceof Uint8Array) {
      if (uuid.length !== BYTES_128BIT) {
        throw new UUIDError("Cannot construct UUID from Uint8Array unless the length is " + BYTES_128BIT + " byes");
      }
      const dataView = new DataView(uuid.buffer);
      this.data = new Uint32Array(INT128_32BIT_WORDS);
      for (let i = 0; i < INT128_32BIT_WORDS; i++) {
        this.data[i] = dataView.getUint32(i * BYTES_32BIT, false /* Big endian */);
      }
    } else if (uuid instanceof UUID && typeof uuid !== "string") {
      this.data = new Uint32Array(INT128_32BIT_WORDS);
      this.data.set(uuid.data);
    } else if (typeof uuid === "string") {
      this.data = UUID.parseString(uuid);
    } else {
      throw new UUIDError("Cannot construct UUID from unsupported data type");
    }
  }

  public toString(): string {
    return UUID.toString(this);
  }

  public static v1(options?: V1Options) {
    const tempBuffer = new Uint8Array(BYTES_128BIT);
    uuidV1(options, tempBuffer);
    const uuid = new UUID(tempBuffer);
    return uuid;
  }

  public static v4(options?: V4Options) {
    const tempBuffer = new Uint8Array(BYTES_128BIT);
    uuidV4(undefined, tempBuffer);
    const uuid = new UUID(tempBuffer);
    return uuid;
  }

  public static v5(name: string | number[], namespace: string | number[]) {
    const tempBuffer = new Uint8Array(BYTES_128BIT);
    uuidV5(name, namespace, tempBuffer);
    const uuid = new UUID(tempBuffer);
    return uuid;
  }

  public static toString(uuid: UUID): string {
    const parts = [
      uuid.data[0].toString(HEX_BASE),
      uuid.data[1].toString(HEX_BASE),
      uuid.data[2].toString(HEX_BASE),
      uuid.data[3].toString(HEX_BASE),
    ].map((v) => leftPad(v, HEX_STR_32BIT_LEN, "0"));

    const hexEndPos1 = HEX_STR_16BIT_LEN;
    const hexEndPos2 = hexEndPos1 + HEX_STR_16BIT_LEN;
    const str = (
      parts[0] + "-" +
      parts[1].slice(0, hexEndPos1) + "-" + parts[1].slice(hexEndPos1, hexEndPos2) + "-" +
      parts[2].slice(0, hexEndPos1) + "-" + parts[2].slice(hexEndPos1, hexEndPos2) +
      parts[3]
    );

    return str;
  }

  private static parseString(str: string): Uint32Array {
    str = str.replace(/[-{}]/g, "");
    if (str.length !== UUID_STRING_LENGTH) {
      throw new UUIDError("Unable to parse UUID from string");
    }

    const ret = new Uint32Array(INT128_32BIT_WORDS);
    for (let i = 0; i < INT128_32BIT_WORDS; i++) {
      const startPos = i * HEX_STR_32BIT_LEN;
      ret[i] = parseInt(str.slice(startPos,  startPos + HEX_STR_32BIT_LEN), HEX_BASE);
    }
    return ret;
  }

}
