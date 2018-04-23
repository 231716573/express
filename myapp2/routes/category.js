var express = require('express');
var router = express.Router();

router.post('/createCategory', function(req, res, next) {
	var order = req.body.order,
			name = req.body.name,
			alias = req.body.alias,
			url = req.body.url;

	var data = {
		order, name, alias, url
	}

	res.send({
		code: 0,
		data: data
	})
})

module.exports = router;