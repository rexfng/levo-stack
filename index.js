const _ = require('lodash')
const path = require('path')
const express = require('express')
const npmdb = require('./npmdb')
const logger = require('morgan')
const bodyParser = require('body-parser')
var app = express()
app.set('port', 3000);
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(logger("default"));


app.get('/api/v1/:collection', function (req, res) {
	npmdb.read(req.params.collection, function(data){
		res.send(data).status(200).end()
	})
})

app.get('/api/v1/:collection/:id', function (req, res) {
	npmdb.readOne(req.params.collection, {_id: req.params.id}, function(data){
		res.send(data).status(200).end()
	})
})

app.post('/api/v1/:collection', function (req, res) {
	npmdb.create(req.params.collection, req.body, function(data){
		res.status(201).end()
	})
})

app.post('/api/v1/:collection/:id', function (req, res) {
	npmdb.update(req.params.collection, {_id: req.params.id}, req.body, function(data){
		res.status(204).end()
	})
})

app.delete('/api/v1/:collection/:id', function (req, res) {
	npmdb.deleteOne(req.params.collection, {_id: req.params.id}, function(success){
		if(success){
			res.status(204).end()
		}else{
			res.status(202).send({msg: "cannot delete a record that does not exist."})
		}
	})
})