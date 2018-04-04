import React from 'react';
import {Link} from 'react-router-dom';

export default class Home extends React.PureComponent {
render() {
	return(
		<div className='Home' style={{display: 'flex'}}>
			<Link to='/teacher/login'>
				<h2>Teacher</h2>
			</Link>
			<div style={{flexGrow: '1'}}/>
			<Link to='/student/login'>
				<h2>Student</h2>
			</Link>
		</div>
	);
}
}
