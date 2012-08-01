app.express.get('/server/*', function (request, response, next) {
  console.log('server!');
  next();
});

app.express.get('/server/set/:id', function (request, response) {
  app.redis.set('test key', request.params.id, function (err, res) {
    response.json('saved ' + request.params.id);
  });  
});

app.express.get('/server/get', function (request, response) {
  app.redis.get('test key', function (err, res) {
    response.json(res);
  });
});
