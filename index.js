#!/usr/bin/env node

var fs = require('fs')
var pdf = require('./')
var path = require('path')

var fs = require('fs')
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const request = require('request');
const getPageCount = require('docx-pdf-pagecount');
app.all('/api/v1/cover', function(req, res, next) {
	var html = req.body.html;
	var format = typeof req.body.format != 'undefined' ? req.body.format : 'A4';
	var border_top = typeof req.body.border_top != 'undefined' ? req.body.border_top : '0cm';
	var border_right = typeof req.body.border_right != 'undefined' ? req.body.border_right : '0cm';
	var border_bottom = typeof req.body.border_bottom != 'undefined' ? req.body.border_bottom : '0cm';
	var border_left = typeof req.body.border_left != 'undefined' ? req.body.border_left : '0cm';
	var header_height = typeof req.body.header_height != 'undefined' ? req.body.header_height : '0cm';
	var header_content = typeof req.body.header_content != 'undefined' ? req.body.header_content : '';
	var footer_height = typeof req.body.footer_height != 'undefined' ? req.body.footer_height : '0cm';
	var footer_content_first = typeof req.body.footer_content_first != 'undefined' ? req.body.footer_content_first : '';
	var footer_content_default = typeof req.body.footer_content_default != 'undefined' ? req.body.footer_content_default : '';
	var footer_content_last = typeof req.body.footer_content_last != 'undefined' ? req.body.footer_content_last : '';
	var type = typeof req.body.type != 'undefined' ? req.body.type : 'pdf';
	var rand = makeid();
	var file_pdf = '/files/'+rand+'.pdf';
	var css_custom = fs.readFileSync('./css/styles.css', 'utf8')
	html = '<style>'+css_custom+'</style>'+html;
	var image = path.join('file://', __dirname, '')
	html = html.replace(/{{image}}/g, image)
	console.log(html);
	//return false;
	var options = {
			"directory": "/files",
			"format": format,
			"orientation": "portrait",
			"border": "0",
			"border": {"top": border_top,"right": border_right,"bottom": border_bottom,"left": border_left},
			"paginationOffset": "1",
			"header": {"height": header_height,"contents": header_content},
			"footer": 
			{
				"height": footer_height,
				"contents": 
				{
					"first": footer_content_first,
					"default": footer_content_default,
					"last": footer_content_last
				}
			},
			"base": 'file://' + path.resolve("./css/styles.css"),
			"type": type
		}
		
	var fullUrl = req.protocol + '://' + req.get('host');
	var dis = '.'+file_pdf;	
	pdf.create(html, options).toFile(dis, function (err, ress) {
		if (err) throw err
		getPageCount(ress.filename)
			.then(pages => {
				console.log(pages);
				var ob = {"num_page":pages, "url": fullUrl+file_pdf}
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(ob));
				res.status(404);
				res.end();
		})
		.catch((err) => {
			console.log(err);
		});
	})
});
app.all('/files/:name', function(req, res, next) {
	console.log(req.params);
	var file = __dirname + '/files/'+req.params.name;
	res.download(file);
});
//htmlpdf(args[0], args[1])


function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 10; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
app.listen(port);
console.log('Server started! At http://localhost:' + port);
