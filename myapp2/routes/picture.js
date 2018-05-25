var express = require('express');
var router = express.Router();
var Picture = require('../models/picture.js');

var multer = require('multer');
var fs = require("fs");//操作文件

var upload = multer({
	dest: './public/picture'
});

router.get('/getPic', function (req, res, next) {

	Picture.get('', function(err, result) {
		res.send({
			code: 0,
			data: result,
			msg: '查询成功！'
		})
	})
})

router.post('/removePic', function (req, res, next) {
	Picture.remove(req.body._id, function(err, result) {
		res.send({
			code: 0,
			msg: '删除成功！'
		})
	})
})

router.get('/editPic', function (req, res, next) {

	Picture.get(req.query._id, function(err, result) {
		res.send({
			code: 0,
			data: result[0],
			msg: '查询成功！'
		})
	})
})

router.post('/editPic', upload.single('imageFile'), function (req, res, next) {

	var file = req.file;

	var title = req.body.update_title,
			content = req.body.update_con,
			update_time = Math.round(new Date() / 1000);
	
	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/picture/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var data = {
			title, content, thunmb, update_time
		}
	} else {
		var data = {
			title, content, update_time
		}
	}

	Picture.update(req.body.update_id, data, function (err, result) {
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
			msg: '删除成功！'
		})
	})
})

router.post('/createpic', upload.single('imageFile'), function (req, res, next) {
	var file = req.file;

	var title = req.body.create_title,
			content = req.body.create_con,
			create_time = Math.round(new Date() / 1000),
			update_time = Math.round(new Date() / 1000),
			author = req.session.user.name,
			clicked = 0;
	
	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/picture/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var newPicture = new Picture({
			title: title,
			author: author,
			content: content,
			thunmb: thunmb
		})
	} else {
		var newPicture = new Picture({
			title: title,
			author: author,
			content: content
		})
	}

	newPicture.save(function(err, user) {
		if (err) {
			res.send({
				code: 2,
				msg: err
			})
			return
		}
		res.send({
			code: 0,
			data: user,
			msg: '添加相册成功！'
		})
	})

})

module.exports = router;