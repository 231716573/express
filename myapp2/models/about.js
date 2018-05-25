var Db = require('./db');
var mongodb = new Db();
var ObjectID = require('mongodb').ObjectID;

function About() {

}

module.exports = About;

About.save = function (data, callback) {
	mongodb.insert(data, 'about', function (err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, data)
	})
}

About.getById = function (_id, callback) {
	var query = {};
	if (_id) {
		query._id = ObjectID(_id);
	}

	mongodb.find(query, 'about', function(err, result) {
    if (err) {
      return callback(err)
    }
    callback(null, result)
  }, 'update_time', -1)

} 

About.getName = function (name, callback) {
	var query = {};
	if (name) {
		query.name = name;
	}

	mongodb.find(query, 'about', function(err, result) {
    if (err) {
      return callback(err)
    }
    callback(null, result)
  }, 'update_time', -1)

} 

About.remove = function (_id, callback) {
	mongodb.remove({_id: ObjectID(_id)}, 'about', function(err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, result)
	})
}

About.update = function(_id, data, callback) {
	var updateStr = {$set: data};

	mongodb.update({_id: ObjectID(_id)}, updateStr, 'about', function(err, result) {
		if (err) {
			return callback(err)
		}
		callback(null, result)
	})
}