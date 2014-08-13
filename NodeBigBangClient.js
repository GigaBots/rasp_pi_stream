var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var http = require("http");

var bigbang = require("./BigBangClient");
var ws = require("websocket");

var NodeBigBangClient = (function (_super) {
    __extends(NodeBigBangClient, _super);
    function NodeBigBangClient() {
        _super.call(this);
    }
    NodeBigBangClient.prototype.connect = function (host, user, password, callback) {
        var _this = this;
        this.login(host, user, password, host, function (loginResult) {
            if (loginResult.authenticated) {
                _this.internalConnect(host, loginResult.clientKey, callback);
            } else {
                var rslt = new bigbang.client.ConnectionResult();
                rslt.message = loginResult.message;
                rslt.success = false;
                callback(rslt);
            }
        });
    };

    NodeBigBangClient.prototype.connectAnonymous = function (host, callback) {
        this.connect(host, null, null, callback);
    };

    NodeBigBangClient.prototype.login = function (host, user, password, application, callback) {
        var hostname = host.split(":")[0];
        var port = host.split(":")[1];

        var protocolHash = this.wireProtocol.protocolHash;

        var uri = "http://" + hostname + ":" + port;

        if (!user && !password) {
            uri += "/loginAnon?application=" + application + "&wireprotocolhash=" + protocolHash;
        } else {
            uri += "/login?username=" + user + "&password=" + password + "&application=" + application + "&wireprotocolhash=" + protocolHash;
        }

        var options = {
            hostname: hostname,
            port: port,
            path: uri,
            method: 'GET'
        };

        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                var loginResult = new bigbang.client.LoginResult();
                var json = JSON.parse(data);

                loginResult.authenticated = json.authenticated;
                loginResult.clientKey = json.clientKey;
                loginResult.message = json.message;

                callback(loginResult);
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    };

    NodeBigBangClient.prototype.internalConnect = function (host, clientKey, callback) {
        var _this = this;
        this._internalConnectionResult = callback;
        this._clientKey = clientKey;
        this.socket = new ws.client();

        this.socket.on('connectFailed', function (error) {
            console.log("websocket connect failed " + error);
        });

        this.socket.on('connect', function (connection) {
            _this.connection = connection;
            _this.onConnect();

            connection.on('error', function (error) {
                console.log('connection error ' + error);
            });

            connection.on('close', function () {
                if (_this._disconnectCallback) {
                    _this._disconnectCallback();
                }
            });

            connection.on('message', function (message) {
                _this.onReceiveText(message.utf8Data);
            });
        });

        this.socket.connect('ws://' + host);
    };

    NodeBigBangClient.prototype.sendToServer = function (msg) {
        var s = this.wireProtocol.wrapNetstring(msg);
        this.connection.sendUTF(s);
    };
    return NodeBigBangClient;
})(bigbang.client.AbstractBigBangClient);
exports.NodeBigBangClient = NodeBigBangClient;
