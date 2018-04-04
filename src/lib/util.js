import _ from 'lodash';

export function handle200(res, responseObj, isEncrypt = false) {
	return res.status(200).json({
		'responseObject' : {
			status: 'success',
			encrypted: isEncrypt.toString(),
			numberResult: _.isArray(responseObj) ? responseObj.length : '1',
			result: responseObj
		}
	});
}

export function handle401(res, responseStr) {
	return res.status(401).json({
		'responseObject': {
			status: 'failure',
			error_message: responseStr
		}
	});
}

export function correctUrlEncode(input) {
	if(_.isArray(input)) {
		return input.reduce((acc, str) => {
			acc.push(str.replace(/\+/g, '').replace(/\s/g, '+'));
			return acc;
		}, []);
	}
	else {
		return input.replace(/\+/g, '').replace(/\s/g, '+');
	}
}
