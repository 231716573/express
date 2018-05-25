var express = require('express');
var router = express.Router();
var nav = require('../models/nav.js')

var multer = require('multer');
var fs = require("fs");//操作文件

var upload = multer({
	dest: './public/nav'
});

router.post('/createNav', upload.single('imageFile'), function (req, res, next) {
	var file = req.file;

	var order = req.body.create_order,
			name = req.body.create_name,
			alias = req.body.create_alias,
			url = req.body.create_url;

	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/nav/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var newNav = new nav(order, name, alias, url, thunmb);
	} else {
		var newNav = new nav(order, name, alias, url);
	}
	
	newNav.save(function (err, result) {
		if (err) {
			console.log(err)
			return
		}

		res.send({
			code: 0,
			msg: '添加成功！'
		})
	})
})

router.get('/getNav', function (req, res, next) {
	nav.get('', function (err, navi) {
		res.send({
			code: 0,
			data: navi,
			msg: '查询成功！'
		})
	}, 'order', 1)
})

router.post('/removeNav', function (req, res, next) {
	var name = req.body.name;

	nav.remove(name, function(err, result) {
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


router.get('/updateNavi', function (req, res, next) {
	var name = req.query.name;

	nav.get(name, function(err, result) {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 0,
			data: result[0],
			msg: '查询成功！'
		})
	})
})

router.post('/updateNavi', upload.single('imageFile'), function (req, res, next) {

	var dateNow = Math.round(new Date() / 1000);
	var file = req.file;

	var order = req.body.update_order,
			name = req.body.update_name,
			alias = req.body.update_alias,
			_id = req.body.update_id,
			url = req.body.update_url;

	if (file) {
		var thunmb = dateNow + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/nav/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var data = {
			order, name, alias, url, thunmb, update_time: dateNow
		}
	} else {
		var data = {
			order, name, alias, url, update_time: dateNow
		}
	}

	nav.update(_id, data, function (err, result) {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 0,
			msg: '修改成功！'
		})
	})
})
module.exports = router;