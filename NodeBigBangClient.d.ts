/// <reference path="PewRuntime.d.ts" />
/// <reference path="WireProtocol.Protocol.d.ts" />
/// <reference path="node.d.ts" />
/// <reference path="websocket.d.ts" />
import pew = require("./PewRuntime");
import wire = require("./WireProtocol.Protocol");
import bigbang = require("./BigBangClient");
export declare class NodeBigBangClient extends bigbang.client.AbstractBigBangClient implements wire.WireProtocolProtocolListener {
    private socket;
    private connection;
    constructor();
    public connect(host: string, user: string, password: string, callback: (connectionResult: bigbang.client.ConnectionResult) => any): void;
    public connectAnonymous(host: string, callback: (connectionResult: bigbang.client.ConnectionResult) => any): void;
    public login(host: string, user: string, password: string, application: string, callback: (loginResult: bigbang.client.LoginResult) => any): void;
    public internalConnect(host: string, clientKey: string, callback: (connectionResult: bigbang.client.ConnectionResult) => any): void;
    public sendToServer(msg: pew.PewMessage): void;
}
