var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

function Nav(order, name, alias, url, thunmb) {
	this.order = order;
	this.name = name;
	this.alias = alias;
	this.url = url;
	this.thunmb = thunmb;
}

module.exports = Nav;

// 储存一个导航
Nav.prototype.save = function(callback) {
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
  var nav = {
  	order: this.order,
  	name: this.name,
  	alias: this.alias,
  	url: this.url,
  	thunmb: this.thunmb,
  	create_time: time
  } 

  mongodb.insert(nav, 'nav', function(err, result) {
  	if (err) {
  		return callback(err);
  	}
  	callback(null, result)
  })
}

Nav.get = function(name, callback, sortData, sortType) {
	var query = {};
	if (name) {
		query.name = name
	}

	if (sortData) {
		mongodb.find(query, 'nav', function (err, result) {
			if (err) {
				return callback(err)
			}
			callback(null, result)
		}, sortData, sortType)
	} else {
		mongodb.find(query, 'nav', function (err, result) {
			if (err) {
				return callback(err)
			}
			callback(null, result)
		})
	}
}

// 删除导航
Nav.remove = function(name, callback) {
	mongodb.remove({name: name}, 'nav', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}

// 更新数据
Nav.update = function(_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'nav', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}