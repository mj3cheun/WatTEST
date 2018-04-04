import React from 'react';

import {send, recieve} from './P2PComms';

import Quiz from './Quiz.jsx';

export default class Display extends React.Component {
	constructor() {
		super();
		this.state = {
			data: null,
			quizActive: false
		};
	}

	componentDidMount() {
		recieve(data => {
			if(data === 'quiz_start') {
				this.setState({quizActive: true});
			}
			else if(data === 'quiz_finish') {
				this.setState({quizActive: false});
			}
			else {
				this.setState({data});
			}
		});
	}

	render() {
		return (
			<div className="Display">
				{
					this.state.quizActive
						? <Quiz data={this.state.data}/>
						: <div>Waiting</div>
				}
			</div>
		);
	}
}
