var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

function Category(order, name, url, description) {
	this.order = order;
	this.name = name;
	this.url = url;
	this.description = description;
}

module.exports = Category;

// 存储一个分类
Category.prototype.save = function(callback) {
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
  var cate = {
  	order: this.order,
  	name: this.name,
  	url: this.url,
  	description: this.description,
  	create_time: time
  };

  mongodb.insert(cate, 'category', function(err, result) {
  	if (err) {
  		return callback(err);
  	}
  	callback(null, cate)
  })
  
}

Category.get = function(name, callback, sortData, sortType) {
  var query = {};
  if (name) {
    query.name = name
  }
  
  if (sortData) {
  	mongodb.find(query, 'category', function(err, result) {
	    if (err) {
	      return callback(err)
	    }
	    callback(null, result)
	  }, sortData, sortType)
  } else {
  	mongodb.find(query, 'category', function(err, result) {
	    if (err) {
	      return callback(err)
	    }
	    callback(null, result)
	  })
  }

} 

// 通过标题，修改分类以及相关信息
Category.update = function(_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'category', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}


Category.remove = function(name, callback) {
	var query = {};
	if (name) {
		query.name = name;
	}

	mongodb.remove(query, 'category', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}