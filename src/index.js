'use strict';

const httpPort = process.env.HTTP_PORT || 8080;
const serialPort = process.env.SERIAL_PORT || '/dev/null';
const baudRate = parseInt(process.env.BAUD_RATE, 10) || 115200;

const App = require('./App');

console.log('Configuration:');
console.log(`httpPort: ${httpPort}`);
console.log(`serialPort: ${serialPort}`);
console.log(`baudRate: ${baudRate}`);

const app = new App(httpPort, serialPort, baudRate);
app.start();
