const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();

const appId = uuidv4();
const appPort = 5050;

app.get('/', (req, res) => {
  res.send(`[${appId}] Hello from K8s cluster backend`);
});

app.listen(appPort, err => {
  console.log(`Backend listening on port ${appPort}`);
});