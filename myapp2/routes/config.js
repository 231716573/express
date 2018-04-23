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
  config.get(null, function (err, conf) {
    res.send({
      code: 0,
      data: conf,
      msg: '查询成功！'
    })
  })
});


router.get('/updateConfig', function(req, res, next) {
  var title = req.query.title;

  config.get(title, function (err, conf) {
    res.send({
      code: 0,
      data: conf[0],
      msg: '查询成功！'
    })
  })
})

router.post('/updateConfig', function (req, res, next) {
  var title = req.body.title,
      name = req.body.name,
      con = req.body.contain

  var data = {
    title, 
    name, 
    con,
    update_time: Math.round(new Date() / 1000)
  }

  config.modify(title, data, function(err, result) {
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


router.post('/removeConfig', function (req, res, next) {
  var title = req.body.title;

  config.delete(title, function(err, result) {
    if (err) {
      res.send({
        code: 2,
        msg: err
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
module.exports = router