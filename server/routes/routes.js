app.express.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.express.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        app.express[key](route, a[key]);
        break;
    }
  }
};
app.express.get('/server/*', function (request, response, next) {
  request.session.asd = (request.session.asd || 0) + 1;
  console.log(request.session.asd);
  next();
});

app.express.map({
  '/server/redis_test' : {
    '/set/:id' : {
      get : app.server.api.redis_test.set
    },
    '/get' : {
      get : app.server.api.redis_test.get
    }
  } 
});

