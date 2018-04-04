import {getPeer, getStudentConnName} from '../helpers';
import {getData, setData} from './DataStorage';
import getId from 'uniqid';
import isEmpty from 'lodash/isEmpty';

const heartbeatInterval = 3 * 1000; // ms

let connArray = [];
window.con = connArray;

const validateLogin = (user, password) =>
	getData('user', user).password === password || false;

////////////////////////////////////////////////////////////////////////////////
// Broadcast

let broadcastStudentsInput;

export const broadcastIndStudent = connObj => {
	connObj.conn.send(broadcastStudentsInput);
}

export const broadcastStudents = input => {
	broadcastStudentsInput = input;
	if(!input) {
		return 0;
	}
	connArray.map(broadcastIndStudent);
}

////////////////////////////////////////////////////////////////////////////////
// Heartbeat

const heartbeat = setInterval(() => broadcastStudents('tic'), heartbeatInterval);

const heartbeatTimeout = connObj => {
	if(connObj.timeout) {
		clearTimeout(connObj.timeout);
	};
	connObj.timeout = setTimeout(() => {
		const uuid = connObj.uuid;

		for(let i = 0; i < connArray.length; i++) {
			if(connArray[i].uuid === uuid) {
				connArray.splice(i, 1);
				return 0;
			}
		}
	}, 2 * heartbeatInterval);
	return connObj;
}

const heartbeatResponse = (connObj, data) => {
	if(data === 'toc') {
		heartbeatTimeout(connObj);
		return true;
	}
	else {
		return false;
	}
}

////////////////////////////////////////////////////////////////////////////////
// Recieve

let recieveStudentsInput = (student, data) => {

};
export const recieveIndStudent = connObj => {
	connObj.conn.on('data', data => {
		if(heartbeatResponse(connObj, data)) {
			// no-op
		}
		else if(typeof recieveStudentsInput === 'function') {
			recieveStudentsInput(connObj.student, data);
		}
		else {
			console.log('No recieve function');
		}
	});
}

export const recieveStudents = cb => {
	recieveStudentsInput = cb;
	connArray.map(recieveIndStudent);
}

////////////////////////////////////////////////////////////////////////////////
// Initialise

const initStudent = (teacherId, studentId, uuid) => {
	let peer = getPeer(getStudentConnName(teacherId, uuid));
	peer.on('connection', conn => {
		let connObj = {
			student: studentId,
			peer,
			conn,
			uuid
		};
		heartbeatTimeout(connObj);

		recieveIndStudent(connObj);
		broadcastIndStudent(connObj);
		connArray.push(connObj);
	});
}

export const initClassroom = teacherId => new Promise((resolve, reject) => {
	let peer = getPeer(teacherId);
	peer.on('connection', conn => {
		// This is individual student connection
		conn.on('data', data => {
			if(!data) {
				return 0;
			}

			const student = data.user;
			const password = data.password;
			let res;
			if(validateLogin(student, password)) {
				console.log('pass success');
				const uuid = getId();
				res = {
					status: 'success',
					address: getStudentConnName(teacherId, uuid)
				};
				initStudent(teacherId, student, uuid);
			}
			else {
				res = {
					status: 'failure'
				}
			}
			conn.send(res);
		});
	});
	resolve(peer);
});
