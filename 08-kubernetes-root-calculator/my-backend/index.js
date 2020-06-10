const { v4: uuidv4 } = require('uuid');
const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const appId = uuidv4();
const appPort = 4000;

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys);

app.get('/', (req, resp) => {
  resp.send(`[${appId}] Hello from K8s cluster backend`);
});

app.post('/root/', (req, resp) => {
    console.log(req.body);
    const number = req.body.number;
    const degree = req.body.degree;
    const parsedCacheValue = number + ',' + degree;

    console.log("New request with numbers: " + number + " and " + degree);

    redisClient.get(parsedCacheValue, (err, cachedValue) => {
        if (!cachedValue) {
            let rootResult = getRoot(number, degree);
            redisClient.set(parsedCacheValue, rootResult);
            resp.send('New result ' + rootResult);
            pgClient.query('INSERT INTO results VALUES ($1)', [rootResult]).catch(err => console.log(err));
        }
        else {
            resp.send('Result ' + cachedValue);
        }
    });
});

app.get('/results', (req, resp) => {
    pgClient.query('SELECT * FROM results')
        .then(res => resp.send(res.rows))
        .catch(err => console.log(err));
});

app.listen(appPort, err => {
    console.log(`Backend listening on port ${appPort}`);
});

const getRoot = (x, n) => {
  var negate = n % 2 == 1 && x < 0;
  if(negate)
    x = -x;
  var possible = Math.pow(x, 1 / n);
  n = Math.pow(possible, n);
  if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
    return negate ? -possible : possible;
};