import db from '../db';

export const getSave = token => {
	return db.any('SELECT save_data FROM users WHERE token = $1;', [token])
		.then(data => {
			return data.length
				? data[0].save_data
				: {};
		})
		.catch(error => {
			console.log('DB ERROR:')
			console.log(error);
		});
}

export const setSave = (token, data) => {
	return db.any(`UPDATE users SET save_data=$2 WHERE token=$1;`, [token, data])
		.catch(error => {
			console.log('DB ERROR:')
			console.log(error);
		});
}
