import 'whatwg-fetch';

import React from 'react';
import {TextField, RaisedButton} from 'material-ui';

import {encryptRes} from '../../../encrypt.js';

import {getDb, setDb} from './DataStorage';

const fetchOpt = {
	credentials: 'include',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
};

export default class Save extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			user: '',
			password: ''
		}
	}

	login() {
		this.state.encrypt = true;
		return fetch(
			'/api/login',
			{
				...fetchOpt,
				body: JSON.stringify(encryptRes(this.state))
			}
		)
	}

	load() {
		this.login().then(() => {
			fetch('/api/load', fetchOpt)
				.then(response => response.json())
				.then(res => {
					res ? setDb(JSON.parse(res.responseObject.result)) : null
				})
		})
	}

	save() {
		this.login().then(() => {
			fetch('/api/save', {...fetchOpt, body: JSON.stringify(getDb())})
		})
	}

	render() {
		return (
			<div className="Login">
				<div style={{margin: '4rem'}}>
					<TextField
						floatingLabelText='User'
						value={this.state.user}
						onChange={text => {
							this.setState({
								user: text.target.value || ''
							});
						}}
					/>
					<br/>
					<TextField
						floatingLabelText='Password'
						value={this.state.password}
						onChange={text => {
							this.setState({
								password: text.target.value || ''
							});
						}}
					/>
					<br/>
					<RaisedButton
						onClick={() => this.load()}
						label='Load'
					/>
					<RaisedButton
						onClick={() => this.save()}
						label='Save'
					/>
				</div>
			</div>
		);
	}
}
