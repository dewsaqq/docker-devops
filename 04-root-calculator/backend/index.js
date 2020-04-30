const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
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
  resp.send('Hello world!');
});

app.post('/root/', (req, resp) => {
    console.log(req.body);
    const number = req.body.number;
    const degree = req.body.degree;
    const parsedCacheValue = number + ',' + degree;

    console.log("New request with numbers: " + number + " and " + degree);

    redisClient.get(parsedCacheValue, (err, cachedValue) => {
        console.log(getPower(number, degree));
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

app.listen(4000, err => {
    console.log('Server listening on 4000');
});

const getRoot = (x, n) => {
    ng = n % 2;
    if((ng == 1) || x < 0)
       x = -x;
    var r = Math.pow(x, 1 / n);
    n = Math.pow(r, n);
  
    if(Math.abs(x - n) < 1 && (x > 0 === n > 0))
      return ng ? -r : r; 
};