import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

import {handle200, correctUrlEncode} from '../lib/util';
import memoize from '../lib/memoize';

import {signIn, restrictToAdmin, restrictToUser} from '../lib/auth';
import {decryptRes} from '../decrypt';

import {getSave, setSave} from '../lib/saveManager';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({version});
	});

	api.post('/login', decryptRes, (req, res) => {
		const encrypt = req.body.encrypt;
		const user = req.body.user;
		const password = req.body.password;

		signIn(user, password)
			.then(uuid => {
				res.cookie('auth_token' , uuid, {expire : new Date() + 9999});
				return 'success';
			})
			.catch(error => {
				return 'failure';
			})
			.then(outcome => {
				console.log(outcome);
				handle200(res, outcome, encrypt);
			});
	});

	api.post('/save', restrictToUser, (req, res) => {
		const token = req.cookies.auth_token;
		let data = JSON.stringify(req.body);
		setSave(token, data)
			.then(data => {
				handle200(res, data);
			});
	});

	api.post('/load', restrictToUser, (req, res) => {
		const token = req.cookies.auth_token;
		getSave(token)
			.then(data => {
				handle200(res, data);
			});
	});

	return api;
}
