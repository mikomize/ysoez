module.exports = function(logic){
  return {
    redis_test : {
      set : function (request, response) {
        logic.redis_test.set(request.params.id, function (err, res) {
          response.json('saved ' + request.params.id);
        });
      },
      get : function (request, response) {
        logic.redis_test.get(function (err, res) {
          response.json(res);
        });
      }
    }
  };
}
