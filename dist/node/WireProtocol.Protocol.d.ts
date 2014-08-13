/// <reference path="PewRuntime.d.ts" />
import pew = require("./PewRuntime");
export declare class WireProtocol implements pew.PewProtocol {
    constructor();
    public listener: WireProtocolProtocolListener;
    public protocolId: number;
    public protocolHash: string;
    public wrapNetstring(msg: pew.PewMessage): string;
    public dispatchNetstring(s: string): void;
}
export interface WireProtocolProtocolListener {
    onWireChannelDataCreate(msg: WireChannelDataCreate): any;
    onWireChannelDataDel(msg: WireChannelDataDel): any;
    onWireChannelDataDelete(msg: WireChannelDataDelete): any;
    onWireChannelDataPut(msg: WireChannelDataPut): any;
    onWireChannelDataUpdate(msg: WireChannelDataUpdate): any;
    onWireChannelJoin(msg: WireChannelJoin): any;
    onWireChannelLeave(msg: WireChannelLeave): any;
    onWireChannelMessage(msg: WireChannelMessage): any;
    onWireChannelSubscribe(msg: WireChannelSubscribe): any;
    onWireChannelUnSubscribe(msg: WireChannelUnSubscribe): any;
    onWireConnectFailure(msg: WireConnectFailure): any;
    onWireConnectRequest(msg: WireConnectRequest): any;
    onWireConnectSuccess(msg: WireConnectSuccess): any;
    onWireDisconnectRequest(msg: WireDisconnectRequest): any;
    onWireDisconnectSuccess(msg: WireDisconnectSuccess): any;
    onWireQueueMessage(msg: WireQueueMessage): any;
    onWireRpcMessage(msg: WireRpcMessage): any;
}
export declare class WireChannelDataCreate implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static key_IS_SET;
    private static ks_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public key: string;
    public ks: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelDataDel implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static key_IS_SET;
    private static ks_IS_SET;
    private static name_IS_SET;
    public key: string;
    public ks: string;
    public name: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelDataDelete implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static key_IS_SET;
    private static ks_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public key: string;
    public ks: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelDataPut implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static key_IS_SET;
    private static ks_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public key: string;
    public ks: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelDataUpdate implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static key_IS_SET;
    private static ks_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public key: string;
    public ks: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelJoin implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static name_IS_SET;
    private static success_IS_SET;
    private static channelPermissions_IS_SET;
    private static errorMessage_IS_SET;
    public name: string;
    public success: boolean;
    public channelPermissions: string[];
    public errorMessage: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelLeave implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static name_IS_SET;
    public name: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelMessage implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static senderId_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public senderId: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelSubscribe implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static name_IS_SET;
    private static jsonConfig_IS_SET;
    public name: string;
    public jsonConfig: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireChannelUnSubscribe implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static name_IS_SET;
    public name: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireConnectFailure implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static failureMessage_IS_SET;
    public failureMessage: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireConnectRequest implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static version_IS_SET;
    private static clientKey_IS_SET;
    public version: number;
    public clientKey: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireConnectSuccess implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static clientId_IS_SET;
    public clientId: string;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireDisconnectRequest implements pew.PewMessage {
    constructor();
    public messageType: number;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireDisconnectSuccess implements pew.PewMessage {
    constructor();
    public messageType: number;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireQueueMessage implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static id_IS_SET;
    private static name_IS_SET;
    private static payload_IS_SET;
    public id: string;
    public name: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
export declare class WireRpcMessage implements pew.PewMessage {
    constructor();
    public messageType: number;
    private static id_IS_SET;
    private static ns_IS_SET;
    private static payload_IS_SET;
    public id: string;
    public ns: string;
    public payload: pew.ByteArray;
    public _pew_bitmask_: number;
    public serializeJson(): string;
    public deserializeJson(json: any): void;
    public setPewBitmask(flag: number): void;
    public unsetPewBitmask(flag: number): void;
    public pewBitmaskIsSetFor(flag: number): boolean;
}
