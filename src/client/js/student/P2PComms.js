import {getPeer, getStudentConnName} from '../helpers.js';

let peer = getPeer();
let conn;

const connTimeout = 3 * 1000; // secs

export const send = input => {
	conn.send(input);
}

export const recieve = cb => {
	console.log('recieve');
	conn.on('data', data => {
		if(data === 'tic') {
			send('toc');
			return 0;
		}
		cb(data);
	});
}

export const connTeacher = (teacherId, user, password) => new Promise((resolve, reject) => {
	let timeout = setTimeout(() => reject(`Timeout ${connTimeout/1000} seconds`), connTimeout);
	conn = peer.connect(teacherId);
	conn.on('open', () => {
		send({user, password});
		conn.on('data', data => {
			clearTimeout(timeout);
			if(data.status === 'success') {
				conn = peer.connect(data.address);
				conn.on('open', () => {
					recieve(() => {/*no-op*/});
					send('connected');
					resolve(peer);
				});
			}
			else {
				reject(data.status);
			}
		});
	});
});
