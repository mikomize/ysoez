
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , nconf = require('nconf')
  , fs = require('fs');
  
_ = require('underscore');

require('cc');
require('./client/TemplatesHandler');

nconf.add('global', {type: 'file', file: 'conf.json'});
nconf.add('user', {type: 'file', file: nconf.get('specificConf').replace(/^~\//, process.env.HOME + '/')});
nconf.remove('global'); //nconf merging direction is so wrong
nconf.add('global', {type: 'file', file: 'conf.json'});
process.env.NODE_ENV = nconf.get('env');

var app = express();

app.configure(function(){
  app.set('port', nconf.get('server:port'));
  app.set('views', __dirname + '/client/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/client/public')));

  var templatesHandler = new TemplatesHandler(nconf);
  templatesHandler.make();
  app.set('styles', fs.readdirSync(nconf.get('stylesDir')));
  app.set('javascripts', fs.readdirSync(nconf.get('javascriptsDir')));
});

app.get('/', function (req, res) {
  res.render('index.ejs', {
    styles: app.get('styles'),
    javascripts: app.get('javascripts')
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
