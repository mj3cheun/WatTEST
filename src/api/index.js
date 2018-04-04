import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

import {handle200, correctUrlEncode} from '../lib/util.js';
import memoize from '../lib/memoize.js';

import {signIn, restrictToAdmin, restrictToUser} from '../lib/auth.js';
import {decryptRes} from '../decrypt';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version,
			help: "To login, send POST request to /login containing username and password. See PDF and README for details..."
		});
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

	api.get('/teacher-id', (req, res) => {
		handle200(res, 'lol');
	});

	return api;
}
