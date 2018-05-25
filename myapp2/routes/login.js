var express = require('express');
var router = express.Router();
var svgCaptcha = require('svg-captcha');
var crypto = require('crypto');
var User = require('../models/user.js')

// >>>>>>>>>>>>>>>>>>>>>>>>跳到登录页面
router.get('/', function (req, res, next) {
	res.render('login/login', { title: '登录后台' })
})

// 登录页面->提交登录
router.post('/', function (req, res, next) {
	var name = req.body.name,
			password = req.body.password;

	User.get(req.body.name, function (err, user) {
		if (!user) {
			res.send({
				code: 1,
				msg: '用户不存在！'
			})
			return
		}

		// 检查密码是否一致
		if (password != user.password) {
			res.send({
				code: 1,
				msg: '密码错误'
			})
			return
		}

		//用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    res.send({
    	code: 0,
    	data: req.session,
			msg: '登录成功！'
    })
	})
})


// >>>>>>>>>>>>>>>>>>>>>>>>跳到注册页面
router.get('/register', function (req, res, next) {
	res.render('login/register', { title: '注册页面' })
})

// 注册页面->提交注册
router.post('/register', function (req, res, next) {
	var name = req.body.name
	var password = req.body.password

	var md5 = crypto.createHash('md5'),
			newPassword = md5.update(req.body.password).digest('hex');

	var newUser = new User({
		name: name,
		password: password
	})


	User.get(newUser.name, function (err, user) {
		if (err) {
			res.send({
				code: 2,
				msg: err
			})
			return
		}

		if (user) {
			res.send({
				code: 1,
				msg: '用户已存在'
			})
			return
		}

		// 如果不存在则新增用户
		newUser.save(function(err, user) {
			if (err) {
				res.send({
					code: 2,
					msg: err
				})
			}
			req.session.user = user;
			res.send({
				code: 0,
				msg: '注册成功'
			})
		})
	})
})


// >>>>>>>>>>>>>>>>>>>>>>>>跳到修改密码
router.get('/modify', function (req, res, next) {
	res.render('login/modify', { title: '修改密码' })
})
// 修改密码->确认修改
router.post('/modify', function (req, res, next) {
	var name = req.body.name,
			oldPassword = req.body.oldPassword,
			newPassword = req.body.newPassword;

	User.get(name, function (err, user) {
		if (!user) {
			res.send({
				code: 1,
				msg: '用户不存在！'
			})
			return
		}

		if (oldPassword != user.password) {
			res.send({
				code: 1,
				msg: '旧密码错误！'
			})
			return
		}
	})

	var newUser = new User({
		name: name,
		password: newPassword
	})

	newUser.edit(function (err, user) {
		res.send({
			code: 0,
			msg: '修改成功！'
		})
	})
})

// =======================>生成验证码
router.get('/captcha', function (req, res, next) {
	// 验证码，对了有两个属性，text是字符，data是svg代码  
  var code = svgCaptcha.create({  
      // 翻转颜色  
      inverse: false,  
      // 字体大小  
      fontSize: 36,  
      // 噪声线条数  
      noise: 3,  
      // 宽度  
      width: 80,  
      // 高度  
      height: 30,  
  });  
  // 保存到session,忽略大小写  
  req.session["randomcode"] = code.text.toLowerCase();  
  // 返回数据直接放入页面元素展示即可  
  res.send(code);  
})


module.exports = router