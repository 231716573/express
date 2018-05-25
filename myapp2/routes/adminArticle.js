var express = require('express');
var router = express.Router();
var article = require('../models/article.js')

var multer = require('multer');
var fs = require('fs');

var upload = multer({
	dest: './public/article'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminArticle/index', { title: '文章列表页' })
});


// ===============>添加文章
router.get('/create', function (req, res, next) {
	res.render('adminArticle/create', { title: '添加文章' })
})
router.post('/create', upload.single('imageFile'), function(req, res, next ) {
	var title = req.body.article_title,
			keyword = req.body.article_keyword,
			description = req.body.article_description,
			content = req.body.article_content,
			category = req.body.cate_id,
			create_time = Math.round(new Date() / 1000),
			update_time = Math.round(new Date() / 1000),
			clicked = 0,
			author = req.session.user.name,
			author_realname = req.session.user.user_realname;

	var file = req.file;

	if (file) {
		var thumb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/article/' + thumb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹的文件
			fs.unlink(tmp_path, function() {
				if (err) throw err;
			})
		})

		var data = {
			thumb, author, author_realname, clicked, category, title, keyword, description, content, create_time, update_time
		}
	} else {
		var data = {
			author, author_realname, clicked, category, title, keyword, description, content, create_time, update_time
		}
	}

	article.save(data, function (err, result) {
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

// ===============>修改文章
router.get('/update', function (req, res, next) {
	res.render('adminArticle/update', { title: '添加文章' })
})
router.post('/update', upload.single('imageFile'), function(req, res, next ) {
	var _id = req.body.article_id,
			title = req.body.article_title,
			keyword = req.body.article_keyword,
			description = req.body.article_description,
			content = req.body.article_content,
			category = req.body.cate_id,
			update_time = Math.round(new Date() / 1000);

	var file = req.file;

	if (file) {
		var thumb = Math.round(new Date() / 1000) + '_' + file.originalname

		var tmp_path = file.path;
		var target_path = './public/article/' + thumb;

		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹的文件
			fs.unlink(tmp_path, function() {
				if (err) throw err;
			})
		})

		var data = {
			thumb, category, title, keyword, description, content, update_time
		}
	} else {
		var data = {
		category, title, keyword, description, content, update_time
		}
	}

	article.update(_id, data, function (err, result) {
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
			msg: '修改成功！'
		})
	})

	
})

router.get('/getArticle', function (req, res, next) {
	var query = '';
	if (req.query._id) {
		query += req.query._id
	}

	var limitN = req.query.limit ? req.query.limit : 100;

	console.log('limitN:'+limitN)

	article.getById(query, function (err, result) {
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
			msg: '查询成功！'
		})
	}, limitN)
})

router.post('/removeArticle', function (req, res, next) {
	var _id = req.body._id;

	article.remove(_id, function (err, result) {
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

router.post('/updateArticleClicked', function (req, res, next) {
	article.getById(req.body.update_id, function (err, result) {
		var clicked = result[0].clicked + 1;
		var data = { clicked: clicked };

		article.update(req.body.update_id, data, function (err, result) {
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

router.get('/getSortClicked', function (req, res, next) {
	article.getSort('clicked', -1, function (err, result) {
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
			msg: '查询成功！'
		})
	}, 4)
})

router.get('/getSortCreate', function (req, res, next) {
	article.getSort('create_time', -1, function (err, result) {
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
			msg: '查询成功！'
		})
	}, 4)
})

router.get('/searchfield', function (req, res, next) {
	var name = req.query.name

	article.getSearch('title', name, function (err, result) {
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
			msg: '查询成功！'
		})
	})
})
module.exports = router