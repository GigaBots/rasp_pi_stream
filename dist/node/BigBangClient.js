var pew = require("./PewRuntime");
var wire = require("./WireProtocol.Protocol");

(function (_client) {
    var LoginResult = (function () {
        function LoginResult() {
        }
        return LoginResult;
    })();
    _client.LoginResult = LoginResult;

    var ResponseWrapper = (function () {
        function ResponseWrapper() {
        }
        return ResponseWrapper;
    })();

    var ChannelError = (function () {
        function ChannelError(msg) {
            this.message = msg;
        }
        ChannelError.prototype.toString = function () {
            return this.message;
        };
        return ChannelError;
    })();
    _client.ChannelError = ChannelError;

    var ChannelMessage = (function () {
        function ChannelMessage() {
        }
        return ChannelMessage;
    })();
    _client.ChannelMessage = ChannelMessage;

    var ConnectionResult = (function () {
        function ConnectionResult() {
        }
        return ConnectionResult;
    })();
    _client.ConnectionResult = ConnectionResult;

    var Channel = (function () {
        function Channel(client) {
            this.client = client;
            this.responses = {};
            this.keySpaces = {};
            this.channelPermissions = [];
            this.currentSubscribers = [];

            this.keySpaces["_meta"] = new ChannelData(client, "_meta", this);
            this.keySpaces["def"] = new ChannelData(client, "def", this);
            this.channelData = this.keySpaces["def"];
        }
        Channel.prototype.subscribers = function () {
            var subs = [];
            var doc = this.metaKeyspace().get("subs");

            if (doc) {
                var subsAry = doc.subs;

                subsAry.forEach(function (id) {
                    subs.push(id);
                });
            }
            return subs;
        };

        Channel.prototype.onMessage = function (message) {
            this.onMessageHandler = message;
        };

        Channel.prototype.onSubscribers = function (join, leave) {
            var _this = this;
            this.metaKeyspace().on("subs", function (doc) {
                var oldSubs = _this.currentSubscribers;
                _this.currentSubscribers = _this.subscribers();

                var diff = _this.diff(oldSubs, _this.subscribers());

                diff.forEach(function (id) {
                    if (oldSubs.indexOf(id) != -1) {
                        leave(id);
                    } else {
                        join(id);
                    }
                });
            }, null);
        };

        Channel.prototype.diff = function (a1, a2) {
            var a = [], diff = [];
            for (var i = 0; i < a1.length; i++)
                a[a1[i]] = true;
            for (var i = 0; i < a2.length; i++)
                if (a[a2[i]])
                    delete a[a2[i]];
                else
                    a[a2[i]] = true;
            for (var k in a)
                diff.push(k);
            return diff;
        };

        Channel.prototype.listChanged = function (orig, current) {
            var result = [];

            orig.forEach(function (key) {
                if (-1 === current.indexOf(key)) {
                    result.push(key);
                }
            }, this);

            return result;
        };

        Channel.prototype.getKeyspace = function (ks) {
            return this.getOrCreateChannelData(ks);
        };

        Channel.prototype.setChannelPermissions = function (perms) {
            this.channelPermissions = perms;
        };

        Channel.prototype.metaKeyspace = function () {
            return this.keySpaces["_meta"];
        };

        Channel.prototype.publish = function (payload, callback) {
            if (this.hasPermission("Publish")) {
                this.publishByteArray(new pew.ByteArray(pew.base64_encode(JSON.stringify(payload))));
                if (callback) {
                    var err = null;
                    callback(err);
                }
            } else {
                if (callback) {
                    callback(new ChannelError("No permission to publish on channel."));
                }
            }
        };

        Channel.prototype.publishByteArray = function (payload) {
            var msg = new wire.WireChannelMessage();
            msg.name = this.name;
            msg.payload = payload;
            this.client.sendToServer(msg);
        };

        Channel.prototype.send = function (payload, callback) {
            var msg = new wire.WireQueueMessage();
            msg.id = null;
            msg.name = this.name;
            msg.payload = new pew.ByteArray(pew.base64_encode(JSON.stringify(payload)));

            if (callback) {
                msg.id = this.randomRequestId();
                var wrapper = new ResponseWrapper();
                wrapper.type = "json";
                wrapper.callback = callback;
                this.responses[msg.id] = wrapper;
            }

            this.client.sendToServer(msg);
        };

        Channel.prototype.hasPermission = function (p) {
            var ret = false;

            this.channelPermissions.forEach(function (perm) {
                if (p == perm) {
                    ret = true;
                }
            });

            return ret;
        };

        Channel.prototype.onWireChannelMessage = function (msg) {
            if (this.onMessageHandler) {
                var channelMessage = new client.ChannelMessage();
                channelMessage.channel = this;
                channelMessage.payload = msg.payload;
                channelMessage.senderId = msg.senderId;
                this.onMessageHandler(channelMessage);
            }
        };

        Channel.prototype.onWireQueueMessage = function (msg) {
            if (msg.id) {
                var wrapper = this.responses[msg.id];

                if (wrapper) {
                    delete this.responses[msg.id];

                    if (wrapper.type == "json") {
                        wrapper.callback(JSON.parse(pew.base64_decode(msg.payload.getBytesAsBase64())));
                    } else if (wrapper.type == "bytes") {
                    } else if (wrapper.type == "string") {
                    } else {
                        console.error("Failed wire queue message.");
                    }
                }
            } else {
                console.error("Error mapping response id " + msg.id);
            }
        };

        Channel.prototype.getOrCreateChannelData = function (ks) {
            var cd;

            if (!ks || "def" == ks) {
                cd = this.keySpaces["def"];
            } else {
                cd = this.keySpaces[ks];
            }

            if (!cd) {
                cd = new ChannelData(this.client, ks, this);
                this.keySpaces[ks] = cd;
            }
            return cd;
        };

        Channel.prototype.onWireChannelDataCreate = function (msg) {
            this.getOrCreateChannelData(msg.ks).onWireChannelDataCreate(msg);
        };

        Channel.prototype.onWireChannelDataUpdate = function (msg) {
            this.getOrCreateChannelData(msg.ks).onWireChannelDataUpdate(msg);
        };

        Channel.prototype.onWireChannelDataDelete = function (msg) {
            this.getOrCreateChannelData(msg.ks).onWireChannelDataDelete(msg);
        };

        Channel.prototype.randomRequestId = function () {
            return Math.floor((Math.random() * 999999) + 1).toString();
        };
        return Channel;
    })();
    _client.Channel = Channel;

    var ChannelData = (function () {
        function ChannelData(client, keySpace, channel) {
            this.client = client;
            this.keySpace = keySpace;
            this.elementMap = {};
            this.updateMap = {};
            this.deleteMap = {};
            this.addListeners = [];
            this.updateListeners = [];
            this.delListeners = [];
            this.channel = channel;
        }
        ChannelData.prototype.get = function (key) {
            return this.elementMap[key];
        };

        ChannelData.prototype.keys = function () {
            var keys = [];

            for (var k in this.elementMap) {
                keys.push(k);
            }
            return keys;
        };

        ChannelData.prototype.put = function (key, value, callback) {
            if (!key) {
                callback(new ChannelError("ChannelData key cannot be null."));
                return;
            } else if (!value) {
                callback(new ChannelError("ChannelData value cannot be null."));
                return;
            }

            if (this.channel.hasPermission("PutChannelData")) {
                var msg = new wire.WireChannelDataPut();
                msg.key = key;
                msg.ks = this.keySpace;
                msg.name = this.channel.name;
                msg.payload = new pew.ByteArray(pew.base64_encode(JSON.stringify(value)));
                this.client.sendToServer(msg);

                if (callback) {
                    callback(null);
                }
            } else {
                if (callback) {
                    callback(new ChannelError("No permission to put on this channel."));
                }
            }
        };

        ChannelData.prototype.del = function (key, callback) {
            if (!key) {
                callback(new ChannelError("ChannelData key cannot be null."));
                return;
            }

            if (this.channel.hasPermission("DelChannelData")) {
                var del = new wire.WireChannelDataDel();
                del.key = key;
                del.ks = this.keySpace;
                del.name = this.channel.name;
                this.client.sendToServer(del);

                if (callback) {
                    callback(null);
                }
            } else {
                if (callback) {
                    callback(new ChannelError("No permission to del on this channel."));
                }
            }
        };

        ChannelData.prototype.on = function (key, update, del) {
            if (update) {
                this.updateMap[key] = update;
            }

            if (del) {
                this.deleteMap[key] = del;
            }
        };

        ChannelData.prototype.onValue = function (create, update, del) {
            if (create) {
                this.addListeners.push(create);
            }

            if (update) {
                this.updateListeners.push(update);
            }

            if (del) {
                this.delListeners.push(del);
            }
        };

        ChannelData.prototype.onWireChannelDataCreate = function (msg) {
            var payload = msg.payload.getBytesAsUTF8();
            var o = JSON.parse(payload);
            this.elementMap[msg.key] = o;

            var update = this.updateMap[msg.key];

            if (update) {
                update(o);
            }

            this.addListeners.forEach(function (callback) {
                callback(msg.key, o);
            });
        };

        ChannelData.prototype.onWireChannelDataUpdate = function (msg) {
            var payload = msg.payload.getBytesAsUTF8();
            var o = JSON.parse(payload);
            this.elementMap[msg.key] = o;

            var update = this.updateMap[msg.key];

            if (update) {
                update(o);
            }

            this.updateListeners.forEach(function (callback) {
                callback(msg.key, o);
            });
        };

        ChannelData.prototype.onWireChannelDataDelete = function (msg) {
            delete this.elementMap[msg.key];
            var del = this.deleteMap[msg.key];

            if (del) {
                del();
            }

            delete this.deleteMap[msg.key];

            this.delListeners.forEach(function (callback) {
                callback(msg.key);
            });
        };
        return ChannelData;
    })();
    _client.ChannelData = ChannelData;

    var AbstractBigBangClient = (function () {
        function AbstractBigBangClient() {
            this.bufString = "";
            this.channelListeners = {};
            this.wireProtocol = new wire.WireProtocol();
            this.wireProtocol.listener = this;
            this.connect = this.connect.bind(this);
            this.onConnect = this.onConnect.bind(this);
            this.subscribe = this.subscribe.bind(this);
            this.channelSubscribeMap = {};
            this.channelMap = {};
        }
        AbstractBigBangClient.prototype.connect = function (host, user, password, callback) {
            throw new Error("abstract");
        };

        AbstractBigBangClient.prototype.connectAnonymous = function (host, callback) {
            throw new Error("abstract");
        };

        AbstractBigBangClient.prototype.sendToServer = function (msg) {
            throw new Error("abstract");
        };

        AbstractBigBangClient.prototype.subscribe = function (channelId, callback) {
            this.channelSubscribeMap[channelId] = callback;
            var msg = new wire.WireChannelSubscribe();
            msg.name = channelId;
            this.sendToServer(msg);
        };

        AbstractBigBangClient.prototype.unsubscribe = function (channelName) {
            throw new Error("Not implemented");
        };

        AbstractBigBangClient.prototype.getChannel = function (channelName) {
            return this.channelMap[channelName];
        };

        AbstractBigBangClient.prototype.onConnect = function () {
            var req = new wire.WireConnectRequest();
            req.clientKey = this._clientKey;
            req.version = 1234;
            this.sendToServer(req);
        };

        AbstractBigBangClient.prototype.onDisconnect = function (notify) {
            throw new Error("abstract");
        };

        AbstractBigBangClient.prototype.disconnect = function () {
            this.sendToServer(new wire.WireDisconnectRequest());
        };

        AbstractBigBangClient.prototype.disconnected = function (callback) {
            this._disconnectCallback = callback;
        };

        AbstractBigBangClient.prototype.publish = function (channel, payload) {
            var msg = new wire.WireChannelMessage();
            msg.name = channel;
            msg.payload = new pew.ByteArray(pew.base64_encode(payload));
            this.sendToServer(msg);
        };

        AbstractBigBangClient.prototype.clientId = function () {
            return this._clientId;
        };

        AbstractBigBangClient.prototype.onReceiveText = function (data) {
            this.bufString += data;
            while (this.parseTextStream()) {
            }
        };

        AbstractBigBangClient.prototype.parseTextStream = function () {
            var delimIdx = this.bufString.indexOf(":");

            if (delimIdx != -1) {
                var lenStr = this.bufString.substr(0, delimIdx);
                var msgLen = parseInt(lenStr);

                if (this.bufString.length < msgLen + 1 + delimIdx) {
                    return false;
                } else {
                    var body = this.bufString.substr(delimIdx + 1, msgLen + 1);

                    var c = body.charAt(body.length - 1);
                    if (c != ',') {
                        console.error("TextProtocol decode exception, not terminated with comma");
                    }

                    var actualBody = body.substr(0, body.length - 1);

                    this.wireProtocol.dispatchNetstring(actualBody);

                    if (this.bufString.length > msgLen + 1 + delimIdx + 1) {
                        var left = this.bufString.substr(msgLen + 1 + delimIdx + 1);
                        this.bufString = left;
                        return true;
                    } else {
                        this.bufString = "";
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

        AbstractBigBangClient.prototype.onWireChannelJoin = function (msg) {
            var callback = this.channelSubscribeMap[msg.name];

            var channel = new Channel(this);
            channel.name = msg.name;
            channel.setChannelPermissions(msg.channelPermissions);

            this.channelMap[channel.name] = channel;

            if (!msg.success) {
                throw new Error("Unable to join channel, redirect this error please");
            }

            if (callback) {
                callback(null, channel);
            }
        };

        AbstractBigBangClient.prototype.onWireChannelLeave = function (msg) {
            delete this.channelListeners[msg.name];
        };

        AbstractBigBangClient.prototype.onWireChannelMessage = function (msg) {
            var channel = this.channelMap[msg.name];
            channel.onWireChannelMessage(msg);
        };

        AbstractBigBangClient.prototype.onWireQueueMessage = function (msg) {
            var channel = this.channelMap[msg.name];
            channel.onWireQueueMessage(msg);
        };

        AbstractBigBangClient.prototype.onWireRpcMessage = function (msg) {
        };

        AbstractBigBangClient.prototype.onWireConnectFailure = function (msg) {
            var cr = new ConnectionResult();
            cr.clientId = null;
            cr.success = false;
            cr.message = msg.failureMessage;
            this._internalConnectionResult(cr);
        };

        AbstractBigBangClient.prototype.onWireConnectSuccess = function (msg) {
            this._clientId = msg.clientId;
            var cr = new ConnectionResult();
            cr.clientId = msg.clientId;
            cr.success = true;
            cr.message = null;
            this._internalConnectionResult(cr);
        };

        AbstractBigBangClient.prototype.onWireChannelDataCreate = function (msg) {
            var channel = this.channelMap[msg.name];

            if (!channel) {
                throw new Error("Channel " + msg.name + " does not exist.");
            }

            channel.onWireChannelDataCreate(msg);
        };

        AbstractBigBangClient.prototype.onWireChannelDataUpdate = function (msg) {
            var channel = this.channelMap[msg.name];

            if (!channel) {
                throw new Error("Channel " + msg.name + " does not exist.");
            }

            channel.onWireChannelDataUpdate(msg);
        };

        AbstractBigBangClient.prototype.onWireChannelDataDelete = function (msg) {
            var channel = this.channelMap[msg.name];

            if (!channel) {
                throw new Error("Channel " + msg.name + " does not exist.");
            }

            channel.onWireChannelDataDelete(msg);
        };

        AbstractBigBangClient.prototype.onWireChannelDataDel = function (msg) {
            console.log('implement me channeldatadel');
        };

        AbstractBigBangClient.prototype.onWireChannelDataPut = function (msg) {
            console.log('implement me channeledataput');
        };

        AbstractBigBangClient.prototype.onWireDisconnectSuccess = function (msg) {
            this.onDisconnect(false);
            if (this._disconnectCallback) {
                this._disconnectCallback();
            }
        };

        AbstractBigBangClient.prototype.onWireChannelUnSubscribe = function (msg) {
            console.log("implement me unsubscrube");
        };

        AbstractBigBangClient.prototype.onWireDisconnectRequest = function (msg) {
        };

        AbstractBigBangClient.prototype.onWireConnectRequest = function (msg) {
        };

        AbstractBigBangClient.prototype.onWireChannelSubscribe = function (msg) {
            console.log('implement me onchannelsubs');
        };
        return AbstractBigBangClient;
    })();
    _client.AbstractBigBangClient = AbstractBigBangClient;
})(exports.client || (exports.client = {}));
var client = exports.client;
