import Peer from 'peerjs';

export const booleanFetch = url => {
	return fetch('/api/' + url, {credentials: 'include'})
		.then(response => {
			return response.json().then(data => data);
		});
}
console.log(JSON.stringify(process.env));
console.log(process.env.NODE_ENV);
export const getPeer = user => new Peer(
	user,
	true
		? {host: 'syde322-a3.herokuapp.com', port: 443, path: '/peerjs'}
		: {host: 'localhost', port: 8080, path: '/peerjs'}
);

export const getStudentConnName = (teacherId, studentId) => `${teacherId}-${studentId}`;
