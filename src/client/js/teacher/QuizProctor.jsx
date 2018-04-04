import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import React from 'react';
import {Redirect} from 'react-router-dom';
import {TextField, RaisedButton} from 'material-ui';

import getId from 'uniqid';

import {getData, setData} from './DataStorage';
import {broadcastStudents, recieveStudents} from './P2PComms';

import QuestionEdit from './components/QuestionEdit.jsx';

import QuizTemplate from './components/QuizTemplate.json';
import QuestionTemplate from './components/QuestionTemplate.json';

export default class QuizProctor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			quiz: null,
			quizQuestion: 0,
			quizResult: {},
			quizState: null
		};

		this.quizId = this.props.match.params.quiz_id;
		this.stateList = ['question_ready', 'question_ongoing', 'question_complete', 'quiz_complete', 'return'];
	}

	componentDidMount() {
		if(this.quizId) {
			const instanceId = getId();
			let quiz = getData('quiz', this.quizId);
			this.setState({quiz, instanceId});
			broadcastStudents('quiz_start');
		}
	}

	saveResults() {
		console.log('resaults');
		console.log(this.state.quizResult);
	}

	advance(state = this.state.quizState) {
		let stateNew;
		const stateList = this.stateList;

		if(state === null) {
			state = stateList[0];
		}

		switch(state) {
			case stateList[0]:
				this.broadcastQuestion(this.state.quizQuestion);
				stateNew = {quizState: stateList[1]};
				break;
			case stateList[1]:
				stateNew = {quizState: stateList[2]};
				break;
			case stateList[2]:
				if(this.state.quizQuestion < this.state.quiz.quiz_question.length - 1) {
					stateNew = {
						quizQuestion: this.state.quizQuestion + 1,
						quizState: stateList[0]
					}
				}
				else {
					stateNew = {quizState: stateList[3]};
				}
				break;
			case stateList[3]:
					broadcastStudents('quiz_finish');
					stateNew = {quizState: stateList[4]};
				break;
			case stateList[4]:
					console.log('back');
				break;
			default:
				console.log('Error');
				console.log(state);
		}
		this.setState(stateNew);
	}

	recieveAnswer(question, student, data) {
		if(!student || !isArray(data)) {
			return;
		}
		else {
			let quizResult = this.state.quizResult;
			let studentResult;

			if(!quizResult[question.question_id]) {
				quizResult[question.question_id] = {};
			}

			if(isEqual(question.question_answer.sort(), data.sort())) {
				studentResult = true;
			}
			else {
				studentResult = false;
			}
			quizResult[question.question_id][student] = studentResult;
			console.log(quizResult);
			this.setState({quizResult});
		}
	}

	broadcastQuestion(questionIndex) {
		let question = this.state.quiz.quiz_question[questionIndex];
		const currentTime = Date.now();

		question.time_start = currentTime + 1 * 1000;
		question.time_finish = question.time_start + question.question_time * 1000;

		broadcastStudents(question);

		setTimeout(() =>
			recieveStudents((student, data) => this.recieveAnswer(question, student, data))
		, question.time_start - currentTime);

		setTimeout(() => {
			recieveStudents(() => {/*no-op*/})
			this.advance();
		}
		, question.time_finish - currentTime);
	}

	render() {
		const quiz = this.state.quiz;

		if(!quiz) {
			return null;
		}
		else {
			const question = quiz.quiz_question[this.state.quizQuestion];
			return (
				<div className={`QuizProctor ${quiz.quiz_name}`}>
					<h2>{quiz.quiz_name}</h2>
					<div>{question.question_name}</div>
					<div>{question.question_body}</div>
					<RaisedButton label='Next' onClick={() => this.advance()}/>
					{
						this.state.quizState === this.stateList[4]
							? <Redirect to='/teacher/library/' push/>
							: null
					}
				</div>
			);
		}
	}
}
