#!/usr/bin/env node

var fs = require('fs')
var pdf = require('../')
var path = require('path')

var args = process.argv.slice(2)

htmlpdf('../test/example.html', '../test.pdf')

function htmlpdf (source, destination) {
  var html = fs.readFileSync(source, 'utf8')
  var options = {
    base: 'file://' + path.resolve(source)
  }
  pdf.create(html, options).toFile(destination, function (err, res) {
    if (err) throw err
  })
}
