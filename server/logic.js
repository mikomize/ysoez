module.exports = function(backend){
  return {
    redis_test : {
      set : function(value,callback){
        backend.redis.set('test key',value,callback);
      },
      get : function(callback){
        backend.redis.get('test key', callback);
      }
    }
  }    
}
