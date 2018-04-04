import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import React from 'react';
import {RaisedButton} from 'material-ui';

import {send, recieve} from './P2PComms';

export default class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
			answer: [],
			isCorrect: null,
			isAnswered: false,
			isOngoing: false,
			isComplete: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if(!isEqual(this.state.data, nextProps.data)) {
			if(isObject) {
				const data = nextProps.data;
				const currentTime = Date.now();
				setTimeout(() => {
					this.setState({isOngoing: true, isComplete: false});
				}, data.time_start - currentTime);
				setTimeout(() => {
					this.setState({isOngoing: false, isComplete: true});
				}, data.time_finish - currentTime);
			}
			this.setState({data: nextProps.data});
		}
	}

	render() {
		return isObject(this.state.data)
			? (
				<div className="Display">
					<div>{this.state.data.question_name}</div>
					<div>{this.state.data.question_body}</div>
					<div>
						{
							this.state.isOngoing
								? this.state.data.question_choice.map((choice, index) =>
										<RaisedButton onClick={() => {
											const answer = [index];
											this.setState(answer);
											send(answer);
										}} label={choice}/>
									)
								: null
						}
						{
							this.state.isComplete
								? <div>
									{
										isEqual(this.state.answer.sort(), this.state.data.question_answer.sort())
											? 'Correct'
											: 'Incorrect'
									}
								</div>
								: null
						}
					</div>
				</div>
			)
			: (
				<div className="Display">
					Connected
				</div>
			);
	}
}
