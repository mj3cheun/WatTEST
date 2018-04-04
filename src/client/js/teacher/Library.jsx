import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Link} from 'react-router-dom';

import getId from 'uniqid';
import reduce from 'lodash/reduce';

import {getTable, deleteData} from './DataStorage';

export default class Library extends React.PureComponent {
	getQuizArray() {
		return reduce(getTable('quiz'), (result, value, key) => {
				value.quiz_id = key;
				result.push(value);
				return result;
			}, []);
	}

	getColumns() {
		const relativePath = '/teacher';
		return [{
			Header: 'Name',
			accessor: 'quiz_name'
			}, {
			Header: 'Last Edited',
			accessor: 'quiz_time_edit',
			Cell: props => new Date(props.value).toLocaleDateString('en-US')
			}, {
			Header: '',
			accessor: 'quiz_id',
			width: 60,
			Cell: props => (
				<Link
					style={{display: 'block', textAlign: 'center'}}
					to={this.props.match.url}
					onClick={() => deleteData('quiz', props.value)}
				>
					Delete
				</Link>
			)}, {
			Header: '',
			accessor: 'quiz_id',
			width: 60,
			Cell: props => this.getCellButton('Edit', `${relativePath}/quiz/edit/${props.value}`)
			}, {
			Header: '',
			accessor: 'quiz_id',
			width: 60,
			Cell: props => this.getCellButton('Start', `${relativePath}/quiz/${props.value}`)
			}
		];
	}

	getCellButton(body, to) {
		return <Link style={{display: 'block', textAlign: 'center'}} to={to || this.props.match.url}>{body}</Link>
	}

	render() {
		const newQuizId = () => getId('quiz_');
		console.log('refresh');
		return (
			<div className="Library">
				<div className='top-bar'>
					<h2>Library</h2>
				</div>
				<div className='menu-bar'>
					<Link to={`/teacher/quiz/edit/${newQuizId()}`}>New Quiz</Link>
					<span style={{width: '50px'}}/>
					<Link to={`/teacher/save`}>Save</Link>
				</div>
				<ReactTable data={this.getQuizArray()} columns={this.getColumns()} pageSize={12}/>
			</div>
		);
	}
}
