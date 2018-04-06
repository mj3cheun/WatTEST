import Peer from 'peerjs';

export const booleanFetch = url => {
	return fetch('/api/' + url, {credentials: 'include'})
		.then(response => {
			return response.json().then(data => data);
		});
}

export const getPeer = user => new Peer(
	user,
	{
	config: {'iceServers': [
	{ url: 'stun:stun.l.google.com:19302' },
	{ url: 'stun:numb.viagenie.ca', credential: '4a4!nJx%O@lR', username: 'manfred.cheung12@gmail.com' },
	{ url: 'turn:numb.viagenie.ca', credential: '4a4!nJx%O@lR', username: 'manfred.cheung12@gmail.com' }
	]},
	...(true
			? {host: 'syde322-a3.herokuapp.com', port: 443, path: '/peerjs'}
			: {host: 'localhost', port: 8080, path: '/peerjs'})
	}
);

export const getStudentConnName = (teacherId, studentId) => `${teacherId}-${studentId}`;
