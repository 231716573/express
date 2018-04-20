var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

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
router.post('/profile/user', function (req, res, next) {
	var user_email = req.body.user_email,
			user_realname = req.body.user_realname,
			user_sex = req.body.user_sex,
			update_time = new Date().getTime();

	var data = {
		user_email, user_realname, user_sex, update_time
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

// >>>>>>>>>>>>>>>>>>>>>>>>跳转到网站配置
router.get('/config', function(req, res, next) {
  res.render('admin/config', { title: '网站配置' })
});
module.exports = router;
