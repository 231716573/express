var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

var multer = require('multer');
var fs = require("fs");//操作文件

var upload = multer({
    dest: './public/avatar'
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: '后台管理首页' })
});

// ===============>跳转到个人资料
router.get('/profile', function(req, res, next) {
  res.render('admin/profile', { title: '后台管理首页' })
});
// 获取个人资料
router.get('/profile/user', function(req, res, next) {
	User.getId(req.session.user._id, function(err, user) {
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
			msg: '查询成功'
		})
	})
})
// 修改个人资料
router.post('/profile/user', upload.single('imageFile'), function (req, res, next) {
	var file = req.file;
	var user_email = req.body.user_email,
			user_realname = req.body.user_realname,
			user_sex = req.body.user_sex,
			update_time = new Date().getTime();

	if (file) {
		var user_thunmb = Math.round(new Date() / 1000) + '_' + file.originalname

		// 获取文件的临时路径
		var tmp_path = file.path;
		// 指定文件上传后的目录 - 
		var target_path = './public/avatar/' + user_thunmb;

		// 移动文件
	  fs.rename(tmp_path, target_path, function(err) {
	    if (err) throw err;
	    // 删除临时文件夹文件, 
	    fs.unlink(tmp_path, function() {
	      if (err) throw err;
	    });
	  });

	  var data = {
			user_email, user_realname, user_sex, user_thunmb, update_time
		}
	} else {
		var data = {
			user_email, user_realname, user_sex, update_time
		}
	}

	

	User.modify(req.session.user._id, data, function(err, user) {
		if (err) {
			res.send({
				code: 2,
				msg: err
			})
			return
		}

		res.send({
			code: 0,
			msg: '修改成功！'
		})
	})
})

// >>>>>>>>>>>>>>>>>>>>>>>>跳转到关于我们
router.get('/about', function(req, res, next) {
  res.render('admin/about', { title: '关于我们' })
});
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到网站配置
router.get('/config', function(req, res, next) {
  res.render('admin/config', { title: '网站配置' })
});
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到文章分类
router.get('/category', function(req, res, next) {
	res.render('category/index', { title: '文章分类' })
})
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到导航
router.get('/nav', function(req, res, next) {
	res.render('nav/index', { title: '网站导航' })
})
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到友情链接
router.get('/link', function(req, res, next) {
	res.render('link/index', { title: '友情链接' })
})
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到日记
router.get('/diary', function(req, res, next) {
	res.render('diary/index', { title: '日记' })
})
// >>>>>>>>>>>>>>>>>>>>>>>>跳转到日记
router.get('/picture', function(req, res, next) {
	res.render('picture/index', { title: '相册' })
})
// >>>>>>>>>>>>>>>>>>>>>>>>退出登录
router.get('/logout', function (req, res, next) {
	req.session.user = null;

	res.send({
		code: 0,
		msg: '退出成功！'
	})
})
module.exports = router;
