/// <reference path="PewRuntime.d.ts" />
/// <reference path="WireProtocol.Protocol.d.ts" />
import pew = require("./PewRuntime");
import wire = require("./WireProtocol.Protocol");
export declare module client {
    interface BigBangClient {
        connect(host: string, user: string, password: string, callback: (connectionResult: ConnectionResult) => any): void;
        connectAnonymous(host: string, callback: (connectionResult: ConnectionResult) => any): void;
        subscribe(channel: string, callback: (err: ChannelError, channel: Channel) => any): void;
        unsubscribe(channel: string): void;
        getChannel(channelName: string): Channel;
        disconnect(): void;
        disconnected(callback: () => any): void;
        clientId(): string;
        sendToServer(msg: pew.PewMessage): void;
    }
    class LoginResult {
        public authenticated: boolean;
        public clientKey: string;
        public message: string;
    }
    class ChannelError {
        public message: string;
        constructor(msg: string);
        public toString(): string;
    }
    class ChannelMessage {
        public senderId: string;
        public channel: Channel;
        public payload: pew.ByteArray;
    }
    class ConnectionResult {
        public success: boolean;
        public clientId: string;
        public message: string;
    }
    class Channel {
        private client;
        private responses;
        private keySpaces;
        private channelPermissions;
        private currentSubscribers;
        private onMessageHandler;
        constructor(client: BigBangClient);
        public name: string;
        public channelData: ChannelData;
        public subscribers(): string[];
        public onMessage(message: (msg: ChannelMessage) => any): void;
        public onSubscribers(join: (s: any) => any, leave: (s: any) => any): void;
        public diff(a1: any, a2: any): string[];
        public listChanged(orig: string[], current: string[]): string[];
        public getKeyspace(ks: string): ChannelData;
        public setChannelPermissions(perms: string[]): void;
        private metaKeyspace();
        public publish(payload: any, callback: (err: ChannelError) => any): void;
        public publishByteArray(payload: pew.ByteArray): void;
        public send(payload: any, callback: (response: any) => any): void;
        public hasPermission(p: string): boolean;
        public onWireChannelMessage(msg: wire.WireChannelMessage): void;
        public onWireQueueMessage(msg: wire.WireQueueMessage): void;
        private getOrCreateChannelData(ks);
        public onWireChannelDataCreate(msg: wire.WireChannelDataCreate): void;
        public onWireChannelDataUpdate(msg: wire.WireChannelDataUpdate): void;
        public onWireChannelDataDelete(msg: wire.WireChannelDataDelete): void;
        private randomRequestId();
    }
    class ChannelData {
        private client;
        private keySpace;
        private channel;
        private elementMap;
        private updateMap;
        private deleteMap;
        private addListeners;
        private updateListeners;
        private delListeners;
        constructor(client: BigBangClient, keySpace: string, channel: Channel);
        public get(key: string): any;
        public keys(): string[];
        public put(key: string, value: any, callback: (err: ChannelError) => any): void;
        public del(key: string, callback: (err: ChannelError) => any): any;
        public on(key: string, update: (o: any) => any, del: () => any): void;
        public onValue(create: (key: string, val: any) => any, update: (key: string, val: any) => any, del: (key: string) => any): void;
        public onWireChannelDataCreate(msg: wire.WireChannelDataCreate): void;
        public onWireChannelDataUpdate(msg: wire.WireChannelDataUpdate): void;
        public onWireChannelDataDelete(msg: wire.WireChannelDataDelete): void;
    }
    class AbstractBigBangClient implements wire.WireProtocolProtocolListener, BigBangClient {
        public wireProtocol: any;
        public _internalConnectionResult: any;
        public _disconnectCallback: any;
        public _clientId: string;
        public _clientKey: string;
        public channelSubscribeMap: {
            [channeId: string]: (err: ChannelError, channel: Channel) => any;
        };
        public channelMap: {
            [channelId: string]: Channel;
        };
        public bufString: string;
        public channelListeners: {
            [s: string]: (channel: string, payload: string) => any;
        };
        public sessionListener: (payload: string) => any;
        constructor();
        public connect(host: string, user: string, password: string, callback: (connectionResult: ConnectionResult) => any): void;
        public connectAnonymous(host: string, callback: (connectionResult: ConnectionResult) => any): void;
        public sendToServer(msg: pew.PewMessage): void;
        public subscribe(channelId: string, callback: (err: ChannelError, channel: Channel) => any): void;
        public unsubscribe(channelName: string): void;
        public getChannel(channelName: string): Channel;
        public onConnect(): void;
        public onDisconnect(notify: any): void;
        public disconnect(): void;
        public disconnected(callback: () => any): void;
        public publish(channel: string, payload: string): void;
        public clientId(): string;
        public onReceiveText(data: string): void;
        public parseTextStream(): boolean;
        public onWireChannelJoin(msg: wire.WireChannelJoin): void;
        public onWireChannelLeave(msg: wire.WireChannelLeave): void;
        public onWireChannelMessage(msg: wire.WireChannelMessage): void;
        public onWireQueueMessage(msg: wire.WireQueueMessage): void;
        public onWireRpcMessage(msg: wire.WireRpcMessage): void;
        public onWireConnectFailure(msg: wire.WireConnectFailure): void;
        public onWireConnectSuccess(msg: wire.WireConnectSuccess): void;
        public onWireChannelDataCreate(msg: wire.WireChannelDataCreate): void;
        public onWireChannelDataUpdate(msg: wire.WireChannelDataUpdate): void;
        public onWireChannelDataDelete(msg: wire.WireChannelDataDelete): void;
        public onWireChannelDataDel(msg: wire.WireChannelDataDel): void;
        public onWireChannelDataPut(msg: wire.WireChannelDataPut): void;
        public onWireDisconnectSuccess(msg: wire.WireDisconnectSuccess): void;
        public onWireChannelUnSubscribe(msg: wire.WireChannelUnSubscribe): void;
        public onWireDisconnectRequest(msg: wire.WireDisconnectRequest): void;
        public onWireConnectRequest(msg: wire.WireConnectRequest): void;
        public onWireChannelSubscribe(msg: wire.WireChannelSubscribe): void;
    }
}
