import Peer from 'peerjs';

export const booleanFetch = url => {
	return fetch('/api/' + url, {credentials: 'include'})
		.then(response => {
			return response.json().then(data => data);
		});
}

export const getPeer = user => new Peer(user, {host: 'localhost', port: 8080, path: '/peerjs'});

export const getStudentConnName = (teacherId, studentId) => `${teacherId}-${studentId}`;
