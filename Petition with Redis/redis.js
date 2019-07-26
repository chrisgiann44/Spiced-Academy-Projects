const redis = require("redis");
const client = redis.createClient(
    // first is for horoku || second is for localhosts
    process.env.REDIS_URL || { host: "localhost", port: 6379 }
);

client.on("error", err => {
    console.log("REDIS err: ", err);
});

//  FOR DEMO purposes
// client.setex("name", 120, "christos");
// we need to promisify so that we can use .then()
const { promisify } = require("util");

// we use bind in order to make sure that setex remembers the client all the time
exports.setex = promisify(client.setex).bind(client);
exports.get = promisify(client.get).bind(client);
exports.del = promisify(client.del).bind(client);
