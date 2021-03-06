import 'whatwg-fetch';

import React from 'react';
import {TextField, RaisedButton} from 'material-ui';

import {encryptRes} from '../../../encrypt.js';

export default class Login extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			user: ''
		}
	}

	render() {
		return (
			<div className="Login">
				<div style={{margin: '4rem'}}>
					<TextField
						floatingLabelText='Classroom Name'
						value={this.state.user}
						onChange={text => {
							this.setState({
								user: text.target.value || ''
							});
						}}
					/>
					<br/>
					<RaisedButton
						onClick={() => this.props.setTeacherId(this.state.user)}
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
