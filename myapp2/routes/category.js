var express = require('express');
var router = express.Router();
var category = require('../models/category.js')

router.get('/getCategory', function (req, res, next) {
	category.get('', function (err, cate) {
		res.send({
			code: 0,
			data: cate,
			msg: '查询成功'
		})
	}, 'order', 1)
})

router.post('/createCategory', function(req, res, next) {
	var order = req.body.order,
			name = req.body.name,
			url = req.body.url,
			description = req.body.description;

	var newCategory = new category(order, name, url, description)


	category.get(name, function (err, cate) {
		if (cate[0]) {
			res.send({
				code: 2,
				cate: cate[0],
				msg: '此分类已存在！'
			})
			return 
		}

		// 如果不存在则新增分类
		newCategory.save(function(err, user) {
			if (err) {
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

})

router.post('/removeCate', function (req, res, next) {
	var name = req.body.name;

	category.remove(name, function (err, cate) {
		if (err) {
			res.send({
					code: 2,
	  			msg: '系统出错！'
				})
				return
		}
		if (cate) {
			res.send({
				code: 0,
				msg: '删除成功！'
			})
		}
	})
})

router.get('/updateCate', function (req, res, next) {
	var name = req.query.name;

	category.get(name, function(err, cate) {
		res.send({
			code: 0,
			data: cate[0],
			msg: '查询成功！'
		})
	})
	
})

router.post('/updateCate', function (req, res, next) {
	var order = req.body.order,
			name = req.body.name,
			url = req.body.url,
			description = req.body.description,
			_id = req.body._id;

	var data = {
		order, 
		name, 
		url, 
		description,
		update_time: Math.round(new Date() / 1000)
	}


	category.update(_id, data, function(err, result) {
		if (err) {
			res.send({
				code: 2,
        msg: err
			})
			return
		}

		res.send({
			code: 0,
			msg: '修改成功！',
			data: result
		})
	})
})
module.exports = router;