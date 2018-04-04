import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {TextField, RaisedButton} from 'material-ui';

import {getData, setData} from './DataStorage';

import QuestionEdit from './components/QuestionEdit.jsx';

import QuizTemplate from './components/QuizTemplate.json';
import QuestionTemplate from './components/QuestionTemplate.json';

// BoolEval
// Prop Dependencies ::
// none

export default class QuizEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			quiz: null
		}

		this.quizId = this.props.match.params.quiz_id;
	}

	componentDidMount() {
		if(this.quizId) {
			let quiz = getData('quiz', this.quizId);
			if(!quiz) {
				quiz = QuizTemplate;
				const timestamp = Date.now();
				quiz.quiz_time_created = timestamp;
				quiz.quiz_time_edit = timestamp;
			}
			this.setState({quiz});
		}
	}

	setQuizProp(key, value) {
		const quizTemp = this.state.quiz;
		quizTemp[key] = value || '';
		this.setState({quiz: quizTemp});
	}

	updateQuestion(index, prop, update) {
		const quizTemp = this.state.quiz;
		if(!isEmpty(prop)) {
			quizTemp.quiz_question[index][prop] = update;
		}
		else {
			quizTemp.quiz_question.splice(index, 1);
		}
		
		this.setState({quiz: quizTemp});
	}

	render() {
		const quiz = this.state.quiz;
		return quiz === null ? null : (
			<div className={`QuizEdit ${quiz.quiz_name}`}>
				<h2>Edit</h2>
				<TextField
					floatingLabelText='Title'
					hintText='My Quiz'
					value={this.state.quiz.quiz_name}
					onChange={text => this.setQuizProp('quiz_name', text.target.value)}
				/>
				<h3>Questions</h3>
				{
					this.state.quiz.quiz_question.map((questionObject, index) =>
						<QuestionEdit
							updateQuestion={(prop, update) => this.updateQuestion(index, prop, update)}
							question={questionObject}
						/>
					)
				}
				<div style={{display: 'flex'}}>
					<RaisedButton label='New Question' onClick={() => {
						let questionTemp = quiz.quiz_question;
						questionTemp.push(cloneDeep(QuestionTemplate));
						this.setQuizProp('quiz_question', questionTemp);
					}}/>
					<div style={{flexGrow: '1'}}/>
					<RaisedButton label='Save' onClick={() => {
						setData('quiz', this.quizId, this.state.quiz);
						window.history.back();
					}}/>
				</div>
			</div>
		);
	}
}
