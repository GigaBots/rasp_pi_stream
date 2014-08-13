export interface PewMessage {
    messageType: number;
    serializeJson(): any;
    deserializeJson(json: any): any;
}
export interface PewProtocol {
}
export declare class ByteArray {
    private base64string;
    constructor(payload: string);
    public getBytesAsBase64(): string;
    public getBytesAsUTF8(): any;
    public getBytesAsJSON(): any;
    public toJSON(): string;
}
export declare function encodeNetstring(s: string): string;
export declare function decodeNetstring(s: string): string;
export declare function base64_encode(data: any): any;
export declare function base64_decode_slow(data: any): any;
export declare function base64_decode_fast(data: any): any;
export declare function base64_decode(data: any): any;
