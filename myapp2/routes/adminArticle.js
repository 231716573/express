var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminArticle/index', { title: '文章列表页' })
});


module.exports = router