import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';

import {Index} from './Index.jsx';

import styles from '!style-loader!css-loader!../styles/index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const mountElement = document.getElementById('container');

export class App extends React.Component {
	render() {
		return (
			<MuiThemeProvider>
				<HashRouter className="App">
					<Route component={Index}/>
				</HashRouter>
			</MuiThemeProvider>
		);
	}
}

// All comments stripped out during production build
console.log("DEVELOPMENT BUILD");
ReactDOM.render(<App/>, mountElement);

export const hardReload = () => {
	ReactDOM.unmountComponentAtNode(mountElement);
	setTimeout(() => ReactDOM.render(<App/>, mountElement), 1);
}
