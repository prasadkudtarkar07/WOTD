const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dateTime = require('node-datetime');
const HashSet = require('hashset');

const Word = require('../models/word');

var today = dateTime.create();

var hashset = new HashSet();

var mongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://node-word-glone.mongodb.net/test";
mongoClient.connect(uri, function(error, client) {
	const collection = client.db("test").collection("words");
	console.log(collection);
	client.close();
});

var todaysWord = function() {

	if (hashset.size().equals(count)) {
		hashset.clear();
	}

	var count = Word.words.count();
	var rand = function(){return Math.floor( Math.random() * count )};
	var temp = Word.words.find().limit(-1).skip(rand()).next();
	if(!hashset.contains(temp)) {
		hashset.add(temp);
		return temp;
	}
	
	todaysWord();
	
};

todaysWord();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling GET requests to /words'
	});
});



router.get('/word-of-the-day', (req, res, next) => {
	var requestday = dateTime.create();
	if(today != requestday) {
		today = dateTime.create();
		todaysWord = function() {
			//get a random word from db not in hashset

			var count = Word.words.count();
			var rand = function(){return Math.floor( Math.random() * count )};

			return Word.words.find().limit(-1).skip(rand()).next();
			//if hashset is full empty hashset
		};
	}
	res.status(200).json({
		message: 'Handling GET requests to /word-of-the-day',
		WOTD: todaysWord
	});
});

router.post('/', (req, res, next) => {

	const word = new Word({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		meaning: req.body.meaning
	});
	word.save().then(result => {
		console.log(result);
	}).catch(error => console.log(error));

	res.status(201).json({
		message: 'Handling POST requests to /words',
		createdWord: word
	});
});

router.get('/:wordId', (req, res, next) => {
	const id = req.params.wordId;
	if(id === 'special') {
		res.status(200).json({
			message: 'You discovered the special ID',
			id: id
		});
	} else {
		Word.findById(id)
			.exec()
			.then(doc => {
				console.log("From database", doc)
				if(doc) {
					res.status(200).json(doc);
				} else {
					res.status(404).json({message: 'No valid entry found'});
				}
			})
			.catch(error => {
				console.log(error);
				res.status(500).json({error: error});
			});
	}
});



module.exports = router;