import zmq from 'zmq';
import Disclose from '../index';


let publisher = process.env.PUBLISHER || 'tcp://127.0.0.1:12345';

let socket = zmq.socket('sub');
socket.identity = 'npm-publish-subscriber-' + process.pid;
socket.connect(publisher);
socket.subscribe(Disclose.EVENT);
socket.on('message', function(type/*, identity*/, event) {
    type = type.toString();
    event = JSON.parse(event.toString());
    console.log(type, event.id);
});