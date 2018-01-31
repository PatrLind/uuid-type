import { V1Options, V4Options } from "uuid/interfaces";
export declare class UUID {
    readonly data: Uint32Array;
    constructor(uuid?: UUID | string | Uint32Array | Uint8Array);
    toString(): string;
    static v1(options?: V1Options): UUID;
    static v4(options?: V4Options): UUID;
    static v5(name: string | number[], namespace: string | number[]): UUID;
    static toString(uuid: UUID): string;
    private static parseString(str);
}
