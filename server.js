var debug = require('debug')('app')
var express = require('express');
var app = express();
var _ = require('lodash');
var auth = require('./app/auth')
var create = require('./app/crud/create')
var read = require('./app/crud/read')
var getAll = require('./app/crud/getAll')
var search = require('./app/crud/search')
var link = require('./app/crud/link')
var suggest= require('./app/crud/suggest')
var update = require('./app/crud/update')

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

/**
* The main file to be run for socket based db server
* Takes two arguments: {configPath} and {ip-address:port} (of the machine being run on, for CORS access)
**/

app.use(bodyParser.json());
app.use(cookieParser('asdfasasdkj3d'))

app.use(function(req, res, next) {
  var corsUrl = process.argv[3] || 'http://localhost:3030'
  res.header("Access-Control-Allow-Origin", corsUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/checkCookie', (req, res) => {
  auth.checkCookie(req.cookies, res)
})

app.post('/login', (req, res) => {
  auth.login(req.body, res)
})

app.get('/logout', (req, res) => {
  auth.logout(res)
})

app.post('/deep/create', (req, res) => {
  create(req.body, res, true)
})

app.post('/create', (req, res) => {
  create(req.body, res)
})

app.post('/deep/read', (req, res) => {
  read(req.body, res, true)
})

app.post('/read', (req, res) => {
  read(req.body, res)
})

app.post('/deep/link', (req, res) => {
  link(req.body, res)
})

app.post('/deep/update', (req, res) => {
  update(req.body, res)
})

app.post('/deep/getAll', (req, res) => {
  getAll(req.body, res, true)
})

app.post('/getAll', (req, res) => {
  getAll(req.body, res)
})

app.post('/deep/suggest', (req, res) => {
  suggest(req.body, res, true)
})

app.post('/suggest', (req, res) => {
  suggest(req.body, res)
})

app.post('/deep/search', (req, res) => {
  search(req.body, res, true)
})

app.post('/search', (req, res) => {
  search(req.body, res)
})

// start the server
app.listen(process.env.PORT || 3001, function() {
  console.log('\nServer ready on port %d\n', process.env.PORT || 3001);
});
