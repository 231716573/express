var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

function Link(order, name, title, url) {
	this.order = order;
	this.name = name;
	this.title = title;
	this.url = url;	
}

module.exports = Link;

// 储存一个友情链接
Link.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
  var time = {
    date: Math.round(new Date() / 1000),
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }

  // 要存入数据库的东西
  var link = {
  	order: this.order,
  	name: this.name,
  	title: this.title,
  	url: this.url,
  	create_time: time
  }

  mongodb.insert(link, 'link', function (err, result) {
  	if (err) {
  		console.log(err)
  	}
  	callback(null, result)
  })
}

// 获取一个友情链接
Link.get = function (name, callback, sortData, sortType) {
	var query = {};
	if (name) {
		query.name = name;
	}

	if (sortData) {
		mongodb.find(query, 'link', function (err, result) {
			if (err) {
				return callback(err)
			}
			callback(null, result)
		}, sortData, sortType)
	} else {
		mongodb.find(query, 'link', function (err, result) {
			if (err) {
				return callback(err)
			}
			callback(null, result)
		})
	}
}


// 删除一个友情链接
Link.remove = function (name, callback) {
	mongodb.remove({name: name}, 'link', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 修改一个友情链接
Link.update = function (_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'link', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}