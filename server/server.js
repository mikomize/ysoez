module.exports = function(redis,nconf){
  var server = {};
  server.backend = {
    redis : redis.createClient(nconf.get('redis:port'))
  };
  server.logic = require('./logic')(server.backend);
  server.api = require('./api')(server.logic);
  return server;
}
