var express = require('express');
var router = express.Router();
var about = require('../models/about.js')

var multer = require('multer');
var fs = require('fs');

var upload = multer({
	dest: './public/article'
})

router.post('/createAbout', upload.single('imageFile'), function(req, res, next) {

	var createTitle = req.body.create_title,
  		createName = req.body.create_name,
  		createContain = req.body.create_contain,
  		create_time = Math.round(new Date() / 1000),
			update_time = Math.round(new Date() / 1000),
			author = req.session.user.name,
			author_realname = req.session.user.user_realname;

	var data = {
		title: createTitle,
		name: createName,
		contain: createContain,
		author: author,
		realname: author_realname,
		create_time: create_time,
		update_time: update_time
	}

  about.save(data, function(err, result) {
  	if (err) {
			console.log(err)
			res.send({
				code: 2,
				msg: '系统出错！'
			})
			return
		}
		res.send({
			code: 0,
			msg: '添加成功！'
		})
  })
})

router.get('/getAbout', function (req, res, next) {
	var query = '';
	if (req.query._id) {
		query += req.query._id
	}

	about.getById(query, function (err, result) {
		if (err) {
			console.log(err)
			res.send({
				code: 2,
				msg: '系统出错！'
			})
			return
		}
		res.send({
			code: 0,
			data: result,
			msg: '查询成功！'
		})
	})
})

router.get('/updateAbout', function (req, res, next) {
	var query = '';
	if (req.query._id) {
		query += req.query._id
	}

	about.getById(query, function (err, result) {
		if (err) {
			console.log(err)
			res.send({
				code: 2,
				msg: '系统出错！'
			})
			return
		}
		res.send({
			code: 0,
			data: result[0],
			msg: '查询成功！'
		})
	})
})

router.post('/updateAbout', upload.single('imageFile'), function (req, res, next) {
	var updateTitle = req.body.update_title,
  		updateName = req.body.update_name,
  		updateContain = req.body.update_contain,
			update_time = Math.round(new Date() / 1000),
			author = req.session.user.name,
			author_realname = req.session.user.user_realname,
			_id = req.body.update_id;

	var data = {
		title: updateTitle,
		name: updateName,
		contain: updateContain,
		author: author,
		realname: author_realname,
		update_time: update_time
	}

  about.update(_id, data, function(err, result) {
  	if (err) {
			console.log(err)
			res.send({
				code: 2,
				msg: '系统出错！'
			})
			return
		}
		res.send({
			code: 0,
			msg: '修改成功！'
		})
  })
})

router.post('/removeAbout', function (req, res, next) {
	var _id = req.body._id;

	about.remove(_id, function (err, result) {
		if (err) {
			console.log(err)
			res.send({
				code: 2,
				msg: '系统出错！'
			})
			return
		}
		res.send({
			code: 0,
			msg: '删除成功！'
		})
	})
})

module.exports = router