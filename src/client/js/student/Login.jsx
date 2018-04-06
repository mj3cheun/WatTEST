import 'whatwg-fetch';

import React from 'react';
import {TextField, RaisedButton} from 'material-ui';

import {encryptRes} from '../../../encrypt';

import {connTeacher} from './P2PComms';

// BoolEval
// Prop Dependencies ::
// none

export default class Login extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			host: '',
			user: '',
			password: ''
		}
	}

	submit() {
		console.log('submitted!');
		connTeacher(this.state.host, this.state.user, this.state.password)
			.then(() => this.props.isAuth(true))
			.catch(e => {
				this.props.isAuth(false);
				console.log('conn fail');
				console.log(e);
			});
	}

	render() {
		return (
			<div className="Login">
				<div style={{margin: '4rem'}}>
					<TextField
						floatingLabelText='Classroom'
						value={this.state.host}
						onChange={text => {
							this.setState({
								host: text.target.value || ''
							});
						}}
					/>
					<br/>
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
						onClick={() => this.submit()}
						label='Enter'
					/>
				</div>
				<div style={{textAlign: 'center', fontWeight: '600'}}>
					{this.state.result || ''}
				</div>
			</div>
		);
	}
}
