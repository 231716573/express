var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

function Picture(pic) {
	this.title = pic.title;
	this.author = pic.author;
	this.content = pic.content;
	this.thunmb = pic.thunmb;
}

module.exports = Picture;

// 储存一个相册
Picture.prototype.save = function (callback) {
	console.log('Picture -> save');

	// 要存入数据库的用户文档
	var user = {
		title: this.title,
		author: this.author,
		content: this.content,
		thunmb: this.thunmb,
		create_time: new Date().getTime(),
		update_time: new Date().getTime(),
		clicked: 0
	}

	mongodb.insert(user, 'picture', function (err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, user)
	})
}

// 获取相册
Picture.get = function (_id, callback) {
	var query = {};
	if (_id) {
		query._id = ObjectID(_id)
	}
	mongodb.find(query, 'picture', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	}, 'create_time', 1)
}

// 删除一个相册
Picture.remove = function(_id, callback) {
	mongodb.remove({_id: ObjectID(_id)}, 'picture', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 通过 _id，修改相册
Picture.update = function(_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'picture', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}