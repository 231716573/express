var express = require('express');
var router = express.Router();
var link = require('../models/link.js')

router.post('/createLink', function (req, res, next) {
	var order = req.body.order,
			name = req.body.name,
			title = req.body.title,
			url = req.body.url;

	var newLink = new link(order, name, title, url);

	newLink.save(function (err, result) {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 0,
			data: result,
			msg: '添加成功！'
		})
	})
})

router.get('/getLink', function (req, res, next) {
	link.get('', function (err, result) {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 0,
			data: result,
			msg: '获取成功！'
		})
	}, 'order', 1)
})

router.post('/removeLink', function (req, res, next) {
	var name = req.body.name;

	link.remove(name, function (err, result) {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 0,
			msg: '删除成功！'
		})
	})
})

router.get('/updateLink', function (req, res, next) {
	var name = req.query.name;

	link.get(name, function (err, result) {
		if (err) {
			console.log(err)
			return
		}

		res.send({
			code: 0,
			data: result[0],
			msg: '获取成功！'
		})

	})
})

router.post('/updateLink', function (req, res,next) {
	var order = req.body.order,
		name = req.body.name,
		title = req.body.title,
		url = req.body.url,
		_id = req.body._id;

	var data = {
		order, name, title, url, update_time: Math.round(new Date() / 1000)
	}

	link.update(_id, data, function (err, result) {
		if (err) {
			console.log(err)
			return
		}

		res.send({
			code: 0,
			data: data,
			msg: '修改成功！'
		})
	})
	
})
module.exports = router;