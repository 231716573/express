var express = require('express');
var router = express.Router();
var category = require('../models/category.js')

var multer = require('multer');
var fs = require("fs");//操作文件

var upload = multer({
	dest: './public/category'
});

router.get('/getCategory', function (req, res, next) {
	category.get('', function (err, cate) {
		res.send({
			code: 0,
			data: cate,
			msg: '查询成功'
		})
	}, 'order', 1)
})

router.post('/createCategory', upload.single('imageFile'), function(req, res, next) {
	var file = req.file;

	var order = req.body.create_order,
			name = req.body.create_name,
			description = req.body.create_description,
			url = req.body.create_url;

	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/category/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var newCategory = new category(order, name, url, description, thunmb)
	} else {
		var newCategory = new category(order, name, url, description)
	}

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

router.get('/getCatePoint', function (req, res, next) {
	var _id = req.query.id;

	category.getPointCate(_id, function (err, cate) {
		res.send({
			code: 0,
			data: cate[0].name,
			msg: '查询单个成功！'
		})
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

router.post('/updateCate', upload.single('imageFile'), function (req, res, next) {
	var dateNow = Math.round(new Date() / 1000);
	var file = req.file;

	var order = req.body.update_order,
			name = req.body.update_name,
			description = req.body.update_description,
			_id = req.body.update_id,
			url = req.body.update_url;

	if (file) {
		var thunmb = dateNow + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/category/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var data = {
			order, name, description, url, thunmb, update_time: dateNow
		}
	} else {
		var data = {
			order, name, description, url, update_time: dateNow
		}
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