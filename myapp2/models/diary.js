var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

var MongoClient = require('mongodb').MongoClient;
var setting = require('../setting')

function Diary(title, author, content, thunmb) {
	this.title = title;
	this.author = author;
	this.content = content;
	this.thunmb = thunmb
}

module.exports = Diary;

// 储存一个日记
Diary.save = function (data, callback) {

	mongodb.insert(data, 'diary', function (err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, data)
	})
}

// 查找一个日记
Diary.get = function(title, callback) {
	var query = {};
	if (title) {
		query.title = title;
	}

	mongodb.find(query, 'diary', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	}, 'create_time', -1)
}

// 通过ID查找一个日记
Diary.getId = function(_id, callback) {
	mongodb.find({_id: ObjectID(_id)}, 'diary', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	}, 'create_time', -1)
}

// 删除一个日记
Diary.remove = function(_id, callback) {
	mongodb.remove({_id: ObjectID(_id)}, 'diary', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 通过_id，修改日记以及相关信息
Diary.update = function(_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'diary', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 通过_id，获取下一篇
Diary.getNext = function(create_time, cb) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('diary');
		// 查询数据
		var whereStr = create_time;

		collection.find({create_time: {$lt: create_time}}, {_id: 1, title: 1}).toArray(function (err, result) {
			if (err) {
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getNext 连接成功');
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}

// 通过_id，获取上一篇
Diary.getPrev = function(create_time, cb) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('diary');
		// 查询数据
		var whereStr = create_time;

		collection.find({create_time: {$gt: create_time}}, {_id: 1, title: 1}).toArray(function (err, result) {
			if (err) {
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getPrev 连接成功');
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}