const keys = require('./keys');

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
 
const appId = uuidv4();
const appPort = 5000;
 
app.get('/', (req, res) => {
  res.send(`[${appId}] Hello from backend app`);
});
 
app.listen(appPort, err => {
  console.log(`Backend listening on port ${appPort}`);
});