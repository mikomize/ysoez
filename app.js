
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    nconf = require('nconf'), 
    fs = require('fs'),
    redis = require('redis'),
    RedisStore = require('connect-redis')(express);

  
_ = require('underscore');


require('cc');
require('./client/TemplatesHandler');

nconf.add('global', {type: 'file', file: 'conf.json'});
nconf.add('user', {type: 'file', file: nconf.get('specificConf').replace(/^~\//, process.env.HOME + '/')});
nconf.remove('global'); //nconf merging direction is so wrong
nconf.add('global', {type: 'file', file: 'conf.json'});
process.env.NODE_ENV = nconf.get('env');

app = {};
app.express = express();

app.express.configure(function(){
  app.express.conf =  nconf;
  app.redis = redis.createClient(nconf.get('redis:port'));
  app.express.set('port', nconf.get('server:port'));
  app.express.set('views', __dirname + '/client/views');
  app.express.set('view engine', 'ejs');
  app.express.use(express.bodyParser());
  app.express.use(express.cookieParser());
  //app.express.use(express.session({ secret: "keyboard cat", store: new RedisStore({"client": app.redis})}));
  app.express.use(express.session({ secret: "keyboard cat"}));

  app.express.use(express.favicon());
  app.express.use(express.logger('dev'));
  app.express.use(express.methodOverride());
  app.express.use(app.express.router);
  app.express.use(express.static(path.join(__dirname, '/client/public')));

  var templatesHandler = new TemplatesHandler(nconf);
  templatesHandler.make();
  app.express.set('styles', fs.readdirSync(nconf.get('stylesDir')));
  app.express.set('javascripts', fs.readdirSync(nconf.get('javascriptsDir')));
});

require('./server/routes/routes.js');

app.express.get('/', function (req, res) {
  res.render('index.ejs', {
    styles: app.express.get('styles'),
    javascripts: app.express.get('javascripts')
  });
});

http.createServer(app.express).listen(app.express.get('port'), function(){
  console.log("Express server listening on port " + app.express.get('port'));
});
