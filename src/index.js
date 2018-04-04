import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import peer from 'peer';

import db from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Front end
app.use('/', express.static(`${__dirname}/client/public`));

// internal middleware
app.use(middleware({ config }));

// api router
app.use('/api', api({ config }));

// peer server
var peerOptions = {
    debug: true
}
app.use('/peerjs', peer.ExpressPeerServer(app.server, peerOptions));

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
