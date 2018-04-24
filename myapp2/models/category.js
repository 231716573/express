var Db = require('./db');
var mongodb = new Db();

function Category(order, name, alias, url) {
	this.order = order;
	this.name = name;
	this.alias = alias;
	this.url = url;
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
  	alias: this.alias,
  	url: this.url,
  	create_time: time
  };

  mongodb.insert(cate, 'category', function(err, result) {
  	if (err) {
  		return callback(err);
  	}
  	callback(null, cate)
  })
  
}

Category.get = function(name, callback) {
  var query = {};
  if (name) {
    query.name = name
  }

  mongodb.find(query, 'category', function(err, result) {
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