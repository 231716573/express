var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

var MongoClient = require('mongodb').MongoClient;
var setting = require('../setting')

function Article() {

}

module.exports = Article;

// 储存一篇文章
Article.save = function (data, callback) {
	mongodb.insert(data, 'article', function (err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, data)
	})
}

// 通过 _id 查找一篇文章
Article.getById = function (_id, callback, limitNum, skipNum) {
	var query = {};

	if (_id) {
		query._id = ObjectID(_id);
	}

	var limitNumber = limitNum ? Number(limitNum) : 100;
	var skipNumber = skipNum ? Number(skipNum) : 0;
	console.log('limitNumber:'+limitNumber)
	console.log('skipNumber:'+skipNumber)

	mongodb.findPage(query, 'article', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	}, limitNumber, skipNumber, 'update_time', -1)
}

Article.getCount = function (_id, cb) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('article');

		collection.count({}, function(err, count){
			callback(null, count)
		})
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getCount 连接成功')
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})

}


// 删除一篇文章
Article.remove = function (_id, callback) {
	mongodb.remove({_id: ObjectID(_id)}, 'article', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 通过_id，修改文章
Article.update = function (_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'article', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 根据创建时间，获取下一篇
Article.getNext = function(update_time, cb) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('article');
		// 查询数据
		var whereStr = update_time;

		collection.find({update_time: {$lt: update_time}}, {_id: 1, title: 1}).toArray(function (err, result) {
			if (err) {
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getNext 连接成功')
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}

// 根据创建时间，获取上一篇
Article.getPrev = function(update_time, cb) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('article');
		// 查询数据
		var whereStr = update_time;

		collection.find({update_time: {$gt: update_time}}, {_id: 1, title: 1}).toArray(function (err, result) {
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

// 获取热门
Article.getSort = function (sortData, sortType, cb, limitNum) {
	var selectData = function(db, callback) {
		// 连接到表
		var collection = db.collection('article');

		if (sortData) {
			var stringJson ='{"'+ sortData +'": '+ sortType +'}';
			var json = JSON.parse(stringJson);
		} else {
			var json = {}
		}

		if (limitNum) {
			collection.find({}).sort(json).limit(limitNum).toArray(function (err, result) {
				if (err) {
					return cb(err);
				}
				callback(null, result)
			})
		} else {
			collection.find({}).sort(json).toArray(function (err, result) {
				if (err) {
					return cb(err);
				}
				callback(null, result)
			})
		}
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getCate 连接成功');
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}

// 使用正则表达式 进行标题模糊搜索
Article.getSearch = function (title, data, cb, sortData, sortType) {
	var selectData = function (db, callback) {
		// 连接到表
		var collection = db.collection('article');

		if (sortData) {
			var stringJson ='{"'+ sortData +'": '+ sortType +'}';
			var json = JSON.parse(stringJson);
		} else {
			var json = {}
		}

		collection.find({title: {$regex:data, $options:"$i"}}).sort(json).toArray(function (err, result) {
			if (err) {
				return cb(err);
			}
			callback(null, result)
		})
	}

	MongoClient.connect(setting.url, function (err, db) {
		console.log('mongodb->getSearch 连接成功')
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result);
		})
	})
}