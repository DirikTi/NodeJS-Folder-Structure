let redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1', {detect_buffers: true});
//detect_buffers: true TODO: u can get data with buffer type
let _ = {};

_.configs = function(){
    client.on('connect', () => {
        console.log('Redis client Connected');
    });

    client.on('error', function (err) {
        throw err;
    })

    return {
        set(key, value){
            client.set(key, value, redis.print);
        },
        get(key){
            client.get(key, (error, result) => {
                if(error){
                    throw error;
                }

                return result;
            });
        },
        hset(hash_key, field, value){
            client.hset(hash_key, field, value, redis.print, (error) => {
                if(error){
                    throw error;
                }
                    
            });
        }
    }
}();

module.exports = _;