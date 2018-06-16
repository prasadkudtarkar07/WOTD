const express = require('express');
const app = express();
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');

const wordRoutes = require('./api/routes/words');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://node-word:secure-node-word@node-word-shard-00-00-glone.mongodb.net:27017,node-word-shard-00-01-glone.mongodb.net:27017,node-word-shard-00-02-glone.mongodb.net:27017/test?ssl=true&replicaSet=node-word-shard-0&authSource=admin&retryWrites=true', {
	useMongoClient: true
});

app.use('/words', wordRoutes);

app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;