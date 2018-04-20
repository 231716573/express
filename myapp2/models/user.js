var Db = require('./db')
var mongodb = new Db()
var ObjectID = require('mongodb').ObjectID;

function User(user) {
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

// 存储用户信息
User.prototype.save = function(callback) {
	console.log('User -> save');
	// 要存入数据库的用户文档
	var user = {
		name: this.name,
		password: this.password,
		create_time: new Date().getTime()
	};

	mongodb.insert(user, 'users', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, user)
	})
}





// 修改用户密码
User.prototype.edit = function(callback) {
	var user = {name: this.name};
	var updateStr = {$set: { "password" : this.password}};
	console.log('User -> edit');
	mongodb.update(user, updateStr, 'users', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result[0])
	})
}
// 修改用户资料
User.modify = function(_id, data, callback) {

	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'users', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result[0])
	})
}







// 读取用户信息
User.get = function(name, callback) {
	mongodb.find({name: name}, 'users', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result[0])
	})
}

// 通过ID读取用户信息
User.getId = function(_id, callback) {
	mongodb.find({_id: ObjectID(_id)}, 'users', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result[0])
	})
}