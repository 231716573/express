var Db = require('./db');
var mongodb = new Db()
var ObjectID = require('mongodb').ObjectID;

function Config(title, name, con, user) {
	this.title = title;
	this.name = name;
	this.con = con
	this.user = user
}

module.exports = Config;

// 存储一个配置项
Config.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
  var time = {
    date: date.getTime(),
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  // 要存入数据库的东西
  var config = {
  	title: this.title,
  	name: this.name,
  	con: this.con,
  	user: this.user,
  	create_time: time
  };

  mongodb.insert(config, 'config', function(err, result) {
  	if (err) {
  		return callback(err);
  	}

  	callback(null, config)
  })

}

// 读取文章以相关信息
Config.get = function(title, callback) {
	var query = {};
	if (title) {
		query.title = title
	}

	mongodb.find(query, 'config', function (err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}