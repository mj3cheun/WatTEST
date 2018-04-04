import 'whatwg-fetch';

import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {initClassroom} from './P2PComms';

import SwitchedRoute from '../components/SwitchedRoute.jsx';

import Login from './Login.jsx';
import Save from './Save.jsx';
import Library from './Library.jsx';
import QuizEdit from './QuizEdit.jsx';
import QuizProctor from './QuizProctor.jsx';
import {PageNotFound} from '../PageNotFound.jsx';

// BoolEval
// Prop Dependencies ::
// none

const setFetch = url => {
	return fetch('/api/' + url, {credentials: 'include'})
		.then(response => {
			return response.json().then(data => data);
		});
}

export class Teacher extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			teacherId: false
		};
	}

	setTeacherId(teacherId) {
		this.setState({teacherId});
		initClassroom('teacher');
	}

	render() {
		const relativePath = this.props.match.url;
		const loginPath = relativePath + '/login';
		const libraryPath = relativePath + '/library';
		return (
			<div className="Teacher">
				<Switch>
					<SwitchedRoute
						toggle={!this.state.teacherId}
						path={loginPath}
						render={props => <Login setTeacherId={id => this.setTeacherId(id)} {...props}/>}
						redirect={libraryPath}
					/>
					<SwitchedRoute
						toggle={this.state.teacherId}
						path={relativePath + '/save'}
						render={props => <Save {...props}/>}
						redirect={loginPath}
					/>
					<SwitchedRoute
						toggle={this.state.teacherId}
						path={libraryPath}
						render={props => <Library setTeacherId={id => this.setTeacherId(id)} {...props}/>}
						redirect={loginPath}
					/>
					<SwitchedRoute
						toggle={this.state.teacherId}
						exact path={relativePath + '/quiz/edit/:quiz_id'}
						render={props => <QuizEdit {...props}/>}
						redirect={loginPath}
					/>
					<SwitchedRoute
						toggle={this.state.teacherId}
						exact path={relativePath + '/quiz/:quiz_id'}
						render={props => <QuizProctor {...props}/>}
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
