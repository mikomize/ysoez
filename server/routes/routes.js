module.exports = function(express,api){
  function map(a, route){
    route = route || '';
    for (var key in a) {
      switch (typeof a[key]) {
        // { '/path': { ... }}
        case 'object':
          map(a[key], route + key);
          break;
        // get: function(){ ... }
        case 'function':
          express[key](route, a[key]);
          break;
      }
    }
  };
  express.get('/server/*', function (request, response, next) {
    request.session.asd = (request.session.asd || 0) + 1;
    console.log(request.session.asd);
    next();
  });

  map({
    '/server' : {
      '/redis_test' : {
        '/set/:id' : {
          get : api.redis_test.set
        },
        '/get' : {
          get : api.redis_test.get
        }
      }
    } 
  });
}
