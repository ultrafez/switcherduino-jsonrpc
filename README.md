# switcherduino-jsonrpc

JSON-RPC 2.0 API to provide HTTP access to an Arduino running [switcherduino](https://github.com/ultrafez/switcherduino/) 433mhz transmitter firmware

## Why?

I want to implement blue-green deployment for my home automation system, which means that multiple instances of it must be able to access the Arduino serial device concurrently. At present, my home automation system obtains an exclusive lock on the serial device directly, so putting this JSON-RPC HTTP API in front of it allows multiple applications to send commands using it.

## Configuration

TODO. The only configuration necessary are the serial port settings and the HTTP port to listen on.

## JSON-RPC API

The API root is available at `/api`. A single JSON-RPC method is available.

### `transmit`

Transmits a 433mhz signal including each of the commands specified in the parameters. Parameters are a series of key-value pairs, which when combined, represent the output signal to transmit. The parameters are intended to be a (more verbose) parallel of the switcherduino firmware's functionality.

#### Parameters

`nexaTransmitter`: Integer. Set the Nexa self-learning transmitter ID used for all Nexa instructions sent in this request. Maximum transmitter code value is 67108863 (26 bits).

Example: `nexaTransmitter: 67108863`

`nexa-s<socket>-power`: Boolean. Turn on/off a Nexa socket. If this parameter is used, the `nexaTransmitter` parameter *must* be included.

Example: `nexa-s10-power: true` turn on Nexa socket 10.

`nexa-s<socket>-dim`: Integer. Set Nexa socket dim level between 0 and 15.

Example: `nexa-s4-dim: 6` set Nexa socket 4 to dim level 6.

`maplin-c<channel>-b<button>`: Boolean. Turn on/off a Maplin socket.

Example: `maplin-c3-b4: true` turn on the socket on channel 3, button 4

#### Response

No specific response will be returned besides either a 200 response for a successful send, or a 4xx/5xx response for an error during sending.


## Example

Request:

```
POST /api HTTP/1.1
Host: some.hostname
Content-Type: application/json
Content-Length: ...
Accept: application/json

{
  "jsonrpc": "2.0",
  "method": "transmit",
  "params": {
    "nexaTransmitter": 24516,
    "nexa-s1-power": true,
    "nexa-s2-power": false,
    "nexa-s12-dim": 10
  },
  "id": 3
}
```

Response:

```
HTTP/1.0 200 OK
Connection: close
Content-Length: ...
Content-Type: application/json
Date: Sat, 08 Jul 2017 12:04:08 GMT

{
    "jsonrpc": "2.0",
    "result": true,
    "id": 3
}
```

## Healthcheck

A healthcheck endpoint is available at `/health` which will always return a 200 response. This is because the application will quit if any errors are experienced (inability to listen on HTTP port; serial port issues). The healthcheck is used in the Docker image.
