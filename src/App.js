'use strict';

const jayson = require('jayson');

class App {
    constructor(httpPort, serialPort, baudRate) {
        this.server = null;
        this.httpPort = httpPort;
        this.serialPort = serialPort;
        this.baudRate = baudRate;
    }

    start() {
        // create a server
        this.server = jayson.server({
            add: function(args, callback) {
                callback(null, args[0] + args[1]);
            }
        });

        this.server.http().listen(httpPort);

        console.log(`Listening on :${httpPort}`);
    }
}

module.exports = App;
