const _ = require('lodash')
const bson = require('bson-objectid')
const documentPath = './db'
const fs = require('fs');
const jsonfile = require('jsonfile')
const path = require('path')

var read = function(collection, callback){
	var file = documentPath + '/' + collection + '.json'
	jsonfile.readFile(file, function(err, objs) {
		if(!err){
			callback(objs)
		}else{
			console.log(err)
			callback({msg: 'error'})
		}
	})
}

var readOne = function(collection, params, callback){
		read(collection, function(res){
			let record = _.filter(res, params)
			callback(record)
		})
	}

var readExceptOne = function(collection, params, callback){
		read(collection, function(res){
			var record = _.reject(res, params)
			callback(record)
		})
	}

var create = function(collection, data, callback){
	createCollection(collection, function(success){
		if (success) {
			read(collection, function(res){
				data = Object.assign({_id: bson.generate()}, data)
				res.push(data)
				jsonfile.writeFileSync(documentPath + '/' + collection + '.json', res)
				callback(true)
			})	
		}
	})	
}

var createCollection = function(collection, callback){
	var file = documentPath + '/' + collection + '.json'
		if (!fs.existsSync(file)) {
			fs.appendFile(file, "[]" , function (err) {
			  if (err) throw err;
			  console.log('created collection ' + collection + '!');
			  callback(true)
			});	
		}else{
			callback(true)
		}
	}

var deleteOne = function(collection, params, callback){
	read(collection, function(res){
		var selected = _.filter(res, params)
		if(!_.isEmpty(selected)){
			var record = _.reject(res, params)
			jsonfile.writeFileSync(documentPath + '/' + collection + '.json', record)
			callback(true)
		}else{
			callback(false)
		}
	})
}

var update = function(collection, params, data, callback){
	read(collection, function(res){
			var selected = _.filter(res, params)
		if(!_.isEmpty(selected)){
			var remained = _.reject(res, params)
			var updated = [Object.assign(selected[0], data)]
			var combined = remained.concat(updated)
			jsonfile.writeFileSync(documentPath + '/' + collection + '.json', combined)
			callback(true)
		}
	})
}

module.exports = {
	read: read, 
	readOne: readOne,
	create: create,
	update: update,
	deleteOne: deleteOne
}

function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}