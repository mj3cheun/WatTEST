import db from '../db';
const fs = require('fs');

const cacheDirectory = './cache';

function getCacheFile(functionName) {
	return `${cacheDirectory}/${functionName}.mem`
};

function fsInit(functionName) {
	let cache;

	// Check to see if a cache directory exists
	if(!fs.existsSync(cacheDirectory)) {
		fs.mkdirSync(cacheDirectory);
	}

	const cacheFile = getCacheFile(functionName);
	// Check to see if a cache object exists
	if(fs.existsSync(cacheFile)) {
		cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
	}
	return new Promise(resolve => resolve(cache));
}

function fsWrite(functionName, cache) {
	fs.writeFile(getCacheFile(functionName), JSON.stringify(cache), () => {/*no-op*/});
}

function getTableName(functionName) {
	return `memoize_${functionName}`;
}

function dbInit(functionName) {
	const tableName = getTableName(functionName).toLowerCase();
	const createTable = `
		CREATE TABLE IF NOT EXISTS ${tableName} (
		input varchar(64) NOT NULL,
		output varchar(1024) NOT NULL,
		PRIMARY KEY (input)
		);`;

	return db.task(t => {
		return t.any(createTable)
		.then(() => {
			return t.any(`SELECT * FROM ${tableName};`);
		});
	})
		.then(data => {
			return data.length
				? data.reduce((acc, val) => {
					try {
						acc[val.input] = JSON.parse(val.output);
					}
					catch(e) {
						acc[val.input] = val.output;
					}
					return acc;
				}, {})
				: {};
		})
		.catch(error => {
			console.log('DB ERROR:')
			console.log(error);
		});
}

function dbWrite(functionName, key, value) {
	db.any(
		`INSERT INTO ${getTableName(functionName)} (input, output) VALUES($1, $2)`,
		[key, value]
	)
		.then(() => {
			// success;
			console.log('DB WRITE')
		})
		.catch(error => {
			// error;
			console.log(error);
		});
}

export default memoize;

function memoize(func, isLocal = false) {
	var functionName = func.name || 'anonymous';
	var cache = {};

	(isLocal
		? fsInit(functionName)
		: dbInit(functionName))
		.then(storedCache => {
			cache = storedCache;
			console.log('Cache Loaded');
		});

	// 'cache' object is used to hold the result of the memoized fn's call
	var recur = function(n) {
		var n = n.toString();
		var result = cache[n];
		if (typeof result === 'undefined') {
			console.log('file write');
			result = func.apply(this, arguments);

			isLocal
				? null
				: dbWrite(functionName, n, result);

			cache[n] = result;

			isLocal
				? fsWrite(functionName, cache)
				: null;

		}
		else {
			console.log('from cache');
		}
		return result;
	}

	return recur;
};
