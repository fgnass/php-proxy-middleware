var express = require('express')
var http = require('http')
var php = require('../')
var test = require('tap').test
var servertest = require('servertest')

var app = express()
app.use(php(__dirname))

var server = http.createServer(app)

test('simple web server', function(t) {
  servertest(server, '/', { encoding: 'utf8' }, function (err, res) {
    t.ifError(err, 'no error')
    t.equal(res.statusCode, 200, 'correct statusCode')
    t.equal(res.body, '1 + 1 = 2', 'correct body content')
    t.end()
  })
})
