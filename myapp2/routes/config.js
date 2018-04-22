var express = require('express');
var router = express.Router();
var config = require('../models/config.js')


/* GET home page. */
router.post('/createConfig', function(req, res, next) {
  var createTitle = req.body.createTitle,
  		createName = req.body.createName,
  		createContain = req.body.createContain,
  		createUser = req.session.user.name

  var newConfig = new config(createTitle, createName, createContain, createUser)

  // 如果不存在则新增配置项
  newConfig.save(function(err, user) {
  	if (err) {
  		res.send({
  			code: 2,
  			msg: '配置项已存在！'
  		})
  		return 
  	}

  	res.send({
  		code: 0,
  		msg: '添加成功！'
  	})
  })
});

router.get('/getConfig', function(req, res, next) {
  res.send({
  	msg: 'getConfig'
  })
});
module.exports = router