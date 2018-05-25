var express = require('express');
var router = express.Router();
var diary = require('../models/diary.js');

var multer = require('multer');
var fs = require("fs");//操作文件

var upload = multer({
	dest: './public/diary'
});


router.get('/getDiary', function (req, res, next) {
	diary.get('', function(err, result) {
		res.send({
			code: 0,
			data: result,
			msg: '查询成功！'
		})
	})
})

router.post('/creatediary', upload.single('imageFile'), function (req, res, next) {
	var file = req.file;

	var title = req.body.create_title,
			content = req.body.create_con,
			description = req.body.create_description,
			create_time = Math.round(new Date() / 1000),
			update_time = Math.round(new Date() / 1000),
			author = req.session.user.name,
			realname = req.session.user.user_realname,
			clicked = 0;

	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/diary/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var data = {
			title, content, description, thunmb, author, realname, clicked, create_time, update_time  
		}
	} else {
		var data = {
			title, content, description, author, realname, clicked, create_time, update_time
		}
	}

	diary.get(data, function(err, result) {
		if (result[0]) {
			res.send({
				code: 1,
				msg: '此日记已存在！'
			})
		}
		return
	})

	// 如果不存在则新增日记
	diary.save(data, function (err, result) {
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

router.post('/removeDiary', function (req, res, next) {
	var _id = req.body._id;

	diary.remove(_id, function (err, result) {
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

router.get('/updateDiary', function (req, res, next) {
	var title = req.query.title;

	diary.get(title, function (err, result) {
		res.send({
			code: 0,
			data: result[0],
			msg: '查询成功！'
		})
	})
	
})

router.post('/updateDiary', upload.single('imageFile'), function (req, res, next) {
	var file = req.file;

	var _id = req.body.update_id,
			title = req.body.update_title,
			content = req.body.update_con,
			description = req.body.update_description,
			update_time = Math.round(new Date() / 1000);

	if (file) {
		var thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/diary/' + thunmb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
		})

		var data = {
			title, content, description, thunmb, update_time  
		}
	} else {
		var data = {
			title, content, description, update_time  
		}
	}

	diary.update(_id, data, function (err, result) {
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
			msg: '修改成功！'
		})
	})
})

router.post('/updateDiaryClicked', function (req, res, next) {
	diary.getId(req.body.update_id, function (err, result) {
		var clicked = result[0].clicked + 1
		var data = { clicked: clicked };

		diary.update(req.body.update_id, data, function (err, result) {
			if (err) {
				console.log(err)
				res.send({
					code: 2,
	  			msg: '系统出错！'
				})
				return
			}
		})

	})
})

module.exports = router;