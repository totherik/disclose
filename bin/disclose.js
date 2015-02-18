#!/usr/bin/env node
import zmq from 'zmq';
import Util from 'util';
import Path from 'path';
import minimist from 'minimist';
import Promulgate from 'promulgate';
import Eid from '../lib/eid';
import Disclose from '../index';



let argv = minimist(process.argv.slice(2), {
    alias: {
        interval: 'i',
        host:     'h',
        address:  'a',
        identity: 'id'
    },
    default: {
        interval: undefined,
        host:     process.env.NPM_PUBLISH_HOST || 'https://skimdb.npmjs.com:443',
        address:  process.env.ZEROMQ_SOCKET_ADDRESS || 'tcp://127.0.0.1:12345',
        identity: process.env.ZEROMQ_SOCKET_IDENTITY || 'npm-publish-source-%d'
    }
});


const START = new Eid(Path.join(__dirname, '..','startkey'));
const VISITED = new Eid(Path.join(__dirname, '..','visited'));


let socket = zmq.socket('pub');
socket.identity = Util.format(argv.identity, process.pid);
socket.bind(argv.address, err => {
    if (err) {
        throw err;
    }

    let startkey = START.read();
    let visited = VISITED.read();

    let stream = new Promulgate(argv.host, argv.interval);
    stream.startkey = startkey || new Date();
    stream.visited = visited ? JSON.parse(visited) : {};

    stream.on('error', function (err) {
        console.error(err);
    });

    stream.on('data', function (data) {
        //socket.send(socket.identity, zmq.ZMQ_SNDMORE);
        socket.send(Disclose.EVENT, zmq.ZMQ_SNDMORE);
        socket.send(JSON.stringify(data));

        // Save state to resume across restarts.
        START.write(stream.startkey);
        VISITED.write(JSON.stringify(stream.visited));
    });
});