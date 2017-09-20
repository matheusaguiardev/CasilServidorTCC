'use strict';

var oneSignal = require('./CreateNotification');

const
    dgram = require('dgram'),
    EventEmitter = require('events'),    
    MEMBERSHIP = "230.185.192.108",
    SERVER_PORT = process.env.PORT || 9090,
    CLIENT_PORT = SERVER_PORT + 1,
    readline = require('readline'),
    os = require('os');

class Socket extends EventEmitter {

    constructor(options) {
        super();
        this.options = options || {
            name: "unamed",
            port: 0,
            target: {
                ip: MEMBERSHIP,
                port: 0
            }
        };
        this.socket = dgram.createSocket("udp4");
        this.socket.on("message", this._onMessage.bind(this));
        this.socket.on("listening", this._onListening.bind(this));
    }

    _onListening() {
        this.emit("listening", this.options);
    }

    _onMessage(message, rinfo) {
        if (message)
            this.emit("receive", JSON.parse(JSON.parse(message.toString())), rinfo);
    }

    send(message) {
        oneSignal(createMessageWithText("Tem alguém na porta !")) ;
        let buf = new Buffer(JSON.stringify(message));
        this.socket.send(buf, 0, buf.length, this.options.target.port, this.options.target.ip);
    }

   
    start() {
        this.socket.bind(this.options.port, () => {
            this.socket.setBroadcast(true);
            this.socket.setMulticastTTL(128);
            this.socket.addMembership(MEMBERSHIP);
        });
    }

}

class Message {

    constructor(message) {
        this._set(message);
    }

    _set(contents) {
        for (let prop in contents)
            if (contents.hasOwnProperty(prop))
                this[prop] = contents[prop];
    }

    toString() {
        return JSON.stringify(this);
    }

    static Register(user) {
        console.log(new Message({ "type": "REGISTER", from: user }).toString())
        console.log('\n')
        return new Message({ "type": "REGISTER", from: user }).toString();
    }

    static Text(text, user) {
        return new Message({ "type": "TEXT", text: text, from: user }).toString();
    }

}

class Discoverable {

    constructor() {
        this.client = new Socket({ name: "CLIENT", port: CLIENT_PORT, target: { ip: MEMBERSHIP, port: SERVER_PORT } });
        this.server = new Socket({ name: "SERVER", port: SERVER_PORT, target: { ip: MEMBERSHIP, port: CLIENT_PORT } });
        this.server.on('receive', this.onServerMessage.bind(this));
        this.registeredUsers = [];
    }

    static get myself() {
        let interfaces = os.networkInterfaces(),
            info = {
                "ip": interfaces[Object.keys(interfaces)[1]].find(elm => elm.family === 'IPv4').address,
                "hostname": os.hostname(),
                "username": os.userInfo().username
            };
        info.hash = require('crypto').createHash("sha1").update(JSON.stringify(info)).digest("hex");
        return info;
    }

    onServerMessage(message) {
        switch (message.type) {
            case "REGISTER":
                this._registerUser(message.from);
                break;
            default:
                if (message.from.hash !== Discoverable.myself.hash)
                    this._showText(message);
                break;
        }
    }

    _showText(message) {
        console.log(`\n${message.from.username}@${message.from.hostname}$ ${message.text}\n`);
    }

    _registerUser(newUser) {
        if (!this.registeredUsers.filter(user => user.hash === newUser.hash).length)
            return this.registeredUsers.push(newUser);
    }

    register() {
        this.client.send(Message.Register(Discoverable.myself));
    }

    text(text) {
        this.client.send(Message.Text(text, Discoverable.myself));
    }

    keepRegistering() {
        setInterval(this.register.bind(this), 5000);
    }

    start() {
        this.server.start();
        this.client.start();
        this.register();
        this.keepRegistering();
    }

}

let discoverable = new Discoverable();
discoverable.start();

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

io.on('line', input => {
    switch (input.toLowerCase()) {
        case "/whosthere":
            console.log(discoverable.registeredUsers);
            break;
        default:
            discoverable.text(input);
            break;
    }
});

function createMessageWithText(msg){
    var message = { 
    app_id: "f970e492-e21e-4d93-bc40-075610c6fc59",
    contents: {"en": msg},
    included_segments: ["All"]
    };
return message;
}