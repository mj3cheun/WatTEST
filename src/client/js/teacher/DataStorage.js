import memoize from 'lodash/memoize';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import localforage from 'localforage';

let storageStrategy = 'localforage';

const storageStrategyArr = [
	'local',
	'localforage',
	'db'
];

let dataStore = {};
let isLoaded = false;

dataStore = {
	user: {
		student1: {
			password: 'password',
			email: 'email@email.com',
			first_name: 'Bob',
			last_name: 'Jones',
			result: [
				{
					result_id: 'id',
					quiz_name: 'quiz',
					quiz_id: 'id',
					quiz_time: '',
					quiz_mark: [
						true,
						false
					]
				}
			]
		}
	},

	quiz: {
		quiz_ef0ew1jffq2frm: {
			quiz_name: 'quiz',
			quiz_time_edit: 1522515901386,
			quiz_time_created: 1522515901386,
			quiz_question: [
				{
					question_id: 'dfhduifhdiufhud',
					question_type: 'multiple_choice',
					question_name: 'First Question',
					question_time: 10,
					question_body_format: 'string',
					question_body: 'What has 4 legs?',
					question_choice: [
						'horse',
						'dolphin',
						'shark'
					],
					question_answer: [0]
				},
				{
					question_id: 'siojodjiodjiodjo',
					question_type: 'multiple_choice',
					question_name: 'Second Question',
					question_time: 10,
					question_body_format: 'string',
					question_body: 'What has 4 legs?',
					question_choice: [
						'horse',
						'dolphin',
						'shark'
					],
					question_answer: [0]
				}
			]
		},
		quiz_40645c1jffq243t: {
			quiz_name: 'quiz 2',
			quiz_time_edit: 1522521743998,
			quiz_time_created: 1522521743998,
			quiz_question: [
				{
					question_id: 'shiousioosmiwk',
					question_type: 'multiple_choice',
					question_name: 'First Question',
					question_time: 10,
					question_body_format: 'string',
					question_body: 'What has 4 legs?',
					question_choice: [
						'horse',
						'dolphin',
						'shark'
					],
					question_answer: [0]
				}
			]
		}
	}
};

export const saveData = () => {
	if(!isLoaded) {
		console.log('Data not loaded!');
	}
	else {
		console.log('SAVE');
	}
}

const loadData = strategy => {
	isLoaded = true;
}

const tableExists = table => {
	if(!isLoaded) {
		loadData(storageStrategy);
	}

	return dataStore[table];
}

const tableKeyExists = (table, key) => {
	return tableExists(table, key) && dataStore[table][key];
}

export const getData = (table, key) => {
	if(tableKeyExists(table, key)) {
		return cloneDeep(dataStore[table][key]);
	}
	else {
		return undefined;
	}
};

export const getTable = table => {
	if(tableExists(table)) {
		return cloneDeep(dataStore[table]);
	}
	else {
		console.log('Table not found');
	}
}

export const setData = (table, key, value) => {
	if(tableExists(table)) {
		dataStore[table][key] = cloneDeep(value);
		return true;
	}
	else {
		return false;
	}
};

export const deleteData = (table, key) => {
	if(tableKeyExists(table, key)) {
		delete dataStore[table][key];
		return true;
	}
	else {
		return false;
	}
}
