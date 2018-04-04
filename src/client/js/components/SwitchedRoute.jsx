import React from 'react';
import {Route, Redirect} from 'react-router-dom';

export default ({ component: Component, render, toggle, redirect, ...rest }) => {
	return (
	<Route
		{...rest}
		render={
			render && toggle
				? render
				: props =>
					toggle
						? <Component {...props}/> || null
						: <Redirect
								to={{
									pathname: redirect,
									state: { from: props.location }
								}}
						/>
		}
	/>
)};
