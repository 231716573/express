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
	})
})

router.post('/createCategory', function(req, res, next) {
	var order = req.body.order,
			name = req.body.name,
			alias = req.body.alias,
			url = req.body.url;

	var newCategory = new category(order, name, alias, url)


	category.get(name, function (err, cate) {
		if(cate[0]) {
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

module.exports = router;