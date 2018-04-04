import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import SwitchedRoute from '../components/SwitchedRoute.jsx';

import Login from './Login.jsx';
import Display from './Display.jsx';
import {PageNotFound} from '../PageNotFound.jsx';

export class Student extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			authenticated: false
		}
	}

	render() {
		const relativePath = this.props.match.url;
		const loginPath = relativePath + '/login';
		const displayPath = relativePath + '/';
		return (
			<div className="Student">
				<Switch>
					<SwitchedRoute
						toggle={!this.state.authenticated}
						path={loginPath}
						render={props => <Login isAuth={isAuth => this.setState({authenticated: isAuth})} {...props}/>}
						redirect={displayPath}
					/>
					<SwitchedRoute
						toggle={this.state.authenticated}
						path={displayPath}
						render={props => <Display {...props}/>}
						redirect={loginPath}
					/>
					<Route
						component={PageNotFound}
					/>
				</Switch>
			</div>
		);
	}
}
