disclose
========


`disclose` is a ZeroMQ publisher of the npm publish event stream.

### Basic Usage
```bash
$ npm i -g disclose
$ disclose
```


### Subscriber Example
```javascript
import zmq from 'zmq';
import Disclose from 'disclose';


let socket = zmq.socket('sub');
socket.identity = 'npm-publish-subscriber-' + process.pid;
socket.connect('tcp://127.0.0.1:12345');
socket.subscribe(Disclose.EVENT);
socket.on('message', function(type/*, identity*/, event) {
    type = type.toString();
    event = JSON.parse(event.toString());
    console.log(event.id);
});
```


### Options
All command-line flags are optional. Defaults are listed below.

##### `--interval`, `-i`
The polling interval, in milliseconds, `disclose` should use when checking
for new packages. Defaults to 30,000 or 30 seconds.

##### `--host`, `-h`
The hostname, including protocol and port, (but not path) of the npm registry to observe. Defaults to `'https://skimdb.npmjs.com:443'`.

##### `--adddess`, `-a`
The address to which ZeroMQ should bind. Defaults to `'tcp://127.0.0.1:12345'`.

##### `--identity`, `-id`
The ZeroMQ socket identity to use. Will be formatted to include process
pid if name contains `'%d'`. Defaults to `'npm-publish-source-%d'`.
