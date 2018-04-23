var MongoClient = require('mongodb').MongoClient;
var setting = require('../setting')

function Db() {
	this.url = setting.url;
}

module.exports = Db;

// 插入
Db.prototype.insert = function(data, col, cb) {
	var insertData = function(db, callback) {
		// 连接到表
		var collection = db.collection(col)
		// 插入数据
		//var data = [{"name":"源宝教程","url":"www.ybao.org"},{"name":"源宝工具","url":"code.ybao.org"}];
		collection.insert(data, function (err, result) {
			if (err) {
				console.log('Error:' + err)
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(this.url, function (err, db) {
		console.log('mongodb->inset 连接成功');
		insertData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}

// 查询
Db.prototype.find = function(data, col, cb) {
	var selectData = function (db, callback) {
		// 连接到表
		var collection = db.collection(col);
		// 查询数据
		// var whereStr = {"name":'源宝教程'};
		var whereStr = data;
		collection.find(whereStr).sort({
			time: -1
		}).toArray(function (err, result) {
			if (err) {
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(this.url, function (err, db) {
		console.log('mongodb->find 连接成功');
		selectData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}


// 修改
Db.prototype.update = function (data, updateData, col, cb) {

	var modifyData = function (db, callback) {
		// 连接到表
		var collection = db.collection(col);
		// 更新数据
		// var whereStr = {'name': '元宝教程'};
		var whereStr = data;
		// var updateStr = {$set: { "url": "https://www.ybao.org" }};
		var updateStr = updateData;
		
		collection.update(whereStr, updateStr, function (err, result) {
			if (err) {
				console.log('Error:' + err)
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(this.url, function (err, db) {
		console.log('mongodb->update 连接成功');
		modifyData(db, function (newerr, result) {
			db.close();
			cb(null, result)
		})
	})
}


// 删除
Db.prototype.remove = function (data, col, cb) {
	var removeData = function (db, callback) {
		// 连接到表
		var collection = db.collection(col);

		collection.remove(data, function (err, result) {
			if (err) {
				console.log('Error:' + err)
				return cb(err)
			}
			callback(null, result)
		})
	}

	MongoClient.connect(this.url, function (err, db) {
		console.log('mongodb->remove 连接成功');
		removeData(db, function (newerr, result) {
			db.close();
			cb(null, result);
		})
	})
}