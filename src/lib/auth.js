import getHash from 'crypto-js/pbkdf2';
import getId from 'uniqid';

import {handle401} from './util';
import db from '../db';

const pepper = 'b03abee7-e072-400d-aad1-3ecb02cf0843';

function getUnixTimestamp() {
	return Math.round((new Date()).getTime() / 1000);
}

function pwdToHash(password, salt) {
	const numIter = 10000;
	return getHash(pepper + password, salt, { keySize: 512/32, iterations: numIter }).toString();
}

export function signIn(user, password) {
	const passwordHash = pwdToHash(password, user);
	const rowArray = [user, passwordHash];
	const uuid = getId();

	return db.task(t => {
		return t.any(`SELECT * FROM users WHERE username=$1 AND password=$2;`, rowArray)
			.then(res => {
				if(res.length) {
					// login success
					return t.any(
						`UPDATE users SET token=$3, last_query=$4 WHERE username=$1 AND password=$2;`,
						[...rowArray, uuid, getUnixTimestamp()]
					);
				}
				else {
					throw new Error('Auth error');
				}
			})
			.then(() => uuid);
	});
}

const restrictPrivilege = (req, res, next, privilege) => {
	const token = req.cookies.auth_token;
	const uuid = getId();
	const time = getUnixTimestamp();
	const expiryPeriod = 60 * 5;

	db.task(t => {
		return t.any(`SELECT * FROM users WHERE token=$1` + (privilege ? ` AND privilege>=$2;` : ';'), privilege ? [token, privilege] : [token])
			.then(dbRes => {
				if((dbRes.length === 1) && (time - dbRes[0].last_query <= expiryPeriod)) {
					// Authenticated
					res.cookie('auth_token' , uuid);
					return t.any(
						`UPDATE users SET token=$2, last_query=$3 WHERE token=$1;`,
						[token, uuid, time]
					);
				}
				else {
					throw new Error('Unauthorized');
				}
			})
			.then(() => req.cookies.auth_token = uuid)
			.then(() => next())
			.catch(e => handle401(res, e.toString()));
	});
}

export const restrictToAdmin = (req, res, next) => {
	return restrictPrivilege(req, res, next, 10);
}

export const restrictToUser = (req, res, next) => {
	return restrictPrivilege(req, res, next, 1);
}
