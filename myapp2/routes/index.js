var express = require('express');
var router = express.Router();
var diary = require('../models/diary.js');
var about = require('../models/about.js');
var article = require('../models/article.js');

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.redirect('/');
});
router.get('/index.html', function(req, res, next) {
	res.redirect('/');
});

router.get('/', function(req, res, next) {
	res.render('frontEnd/index', { title: '小波波滚地球' })
});

router.get('/error', function(req, res, next) {
	res.render('frontEnd/error', { title: '出错啦~~~小波波滚地球' })
});

router.get('/about', function(req, res, next) {
	about.getName('关于我们', function (err, result) {
		res.render('frontEnd/about', { 
			title: '关于我们 - 小波波滚地球',
			data: result[0]
		})
	})
});

router.get('/category', function(req, res, next) {
	res.render('frontEnd/category', { title: '分类 - 小波波滚地球' })
});

router.get('/picture', function(req, res, next) {
	res.render('frontEnd/picture', { title: '相册 - 小波波滚地球' })
});

router.get('/diary', function (req, res, next) {
	res.render('frontEnd/diary', { title: '日记 - 小波波滚地球' })
})

router.get('/diaryDetail/:id', function (req, res, next) {
	diary.getId(req.params.id, function (err, result) {
		diary.getNext(result[0].create_time, function (err, nextResult) {
			diary.getPrev(result[0].create_time, function (err, prevResult) {

				var next = nextResult[0] ? nextResult[0] : '';
				var prev = prevResult[0] ? prevResult[0] : '';
				res.render('frontEnd/diary-detail', { 
					title: result[0].title+' - 日记 - 小波波滚地球',
					diary: result[0],
					next: next,
					prev: prev
				})

			})
		})
	})
})

router.get('/artlist', function (req, res, next) {
	res.render('frontEnd/article-list', { title: '全部文章 - 小波波滚地球' })
})

router.get('/article/:id', function (req, res, next) {
	article.getById(req.params.id, function (err, result) {
		article.getNext(result[0].update_time, function (err, nextResult) {
			article.getPrev(result[0].update_time, function (err, prevResult) {

				var next = nextResult[0] ? nextResult[0] : '';
				var prev = prevResult[0] ? prevResult[0] : '';

				res.render('frontEnd/article-detail', { 
					title: result[0].title+' - 文章 - 小波波滚地球',
					article: result[0],
					next: next,
					prev: prev
				})
			})
		})
	})
})



module.exports = router;
