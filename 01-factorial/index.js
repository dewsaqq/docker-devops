const express = require('express');

const redis = require('redis');

const app = express();

const process = require('process');

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

app.get("/:fact", (req, resp) => {
    const numberToFactorialize = req.params.fact;

    console.log("New request with number: " + numberToFactorialize)

    if (number >= 10) {
        process.exit(1);
    }

    client.get(numberToFactorialize, (err, factorial) => {
        if (!factorial) {
            const result = factorialOf(numberToFactorialize);
            client.set(numberToFactorialize, parseInt(result));
            resp.send('Factorial of ' + numberToFactorialize + ' is: ' + result);
        }
    });
});

const factorialOf = (num) => {
    if (num === 0) {
        return 1;
    } else {
        return num * factorialOf(num -1);
    }
}

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
