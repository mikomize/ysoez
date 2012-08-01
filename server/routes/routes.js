app.get('/server/*', function (request, response, next) {
  request.session.asd = (request.session.asd || 0) + 1;
  console.log(request.session.asd);
  console.log('server!');
  next();
});

app.get('/server/set/:id', function (request, response) {
  app.redis.set('test key', request.params.id, function (err, res) {
    response.json('saved ' + request.params.id);
  });  
});

app.get('/server/get', function (request, response) {
  app.redis.get('test key', function (err, res) {
    response.json(res);
  });
});
