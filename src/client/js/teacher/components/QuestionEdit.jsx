import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Link} from 'react-router-dom';

import {Paper, TextField, Chip, SelectField, MenuItem, RaisedButton} from 'material-ui';

import getId from 'uniqid';

// BoolEval
// Prop Dependencies ::
// none

export default class QuestionEdit extends React.Component {
	constructor() {
		super();
		this.state = {
			choiceTemp: ''
		}
		this.styles = {
			chip: {
				margin: 4,
			},
			wrapper: {
				display: 'flex',
				flexWrap: 'wrap',
			}
		};
	}

	componentDidMount() {
		this.props.updateQuestion('question_id', getId('question_'));
	}

	render() {
		const question = this.props.question;
		const updateQuestion = this.props.updateQuestion;
		return (
			<Paper className='QuestionEdit' style={{marginBottom: '12px', padding: '24px', paddingTop: '12px'}}>
				<TextField
					floatingLabelText='Title'
					hintText="My Quiz"
					value={question.question_name}
					onChange={text => updateQuestion('question_name', text.target.value)}
				/>
				<br/>
				<TextField
					floatingLabelText='Time Allowed (seconds)'
					hintText="10"
					value={question.question_time}
					onChange={text => updateQuestion('question_time', text.target.value)}
				/>
				<br/>
				<TextField
					floatingLabelText='Question'
					hintText='What has 4 legs?'
					value={question.question_body}
					onChange={text => updateQuestion('question_body', text.target.value)}
				/>
				<br/>
				<TextField
					floatingLabelText='Choices'
					hintText='Horse'
					value={this.state.choiceTemp}
					onChange={text => this.setState({choiceTemp: text.target.value})}
					onKeyPress={e => {
						if(e.key === 'Enter') {
							let questionChoice = question.question_choice;
							questionChoice.push(this.state.choiceTemp);
							updateQuestion('question_choice', questionChoice);
							this.setState({choiceTemp: ''});
						}
					}}
				/>
				<br/>
				<div className='chip-wrapper' style={this.styles.wrapper}>
				{
					question.question_choice.map((choice, index) => (
						<Chip style={this.styles.chip} onRequestDelete={() => {
							let questionChoice = question.question_choice;
							questionChoice.splice(index, 1);
							updateQuestion('question_choice', questionChoice);
						}}>
							{choice}
						</Chip>
					))
				}
				</div>
				<SelectField
					floatingLabelText="Answer"
					multiple
					value={question.question_answer}
					onChange={(event, index, values) => updateQuestion('question_answer', values)}
				>
				{
					question.question_choice.map((choice, index) => {
						return <MenuItem value={index} primaryText={choice} />;
					})
				}
				</SelectField>
				<br/>
				<RaisedButton label='Delete Question' onClick={() => updateQuestion()}/>
			</Paper>
		);
	}
}
