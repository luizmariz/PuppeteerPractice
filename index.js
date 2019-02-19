//const App = require('./src/App.js');
const express = require('express');
const urls_controller = require('./src/server/controllers/urls_controller');

const app = express();

app.listen(3000, function () {
  console.log('rogerio listening on port 3000!');
});

app.post('/create', async (req, res) => {
  console.log(res.body)
  await urls_controller.create(res.body);
});

app.get('/exists', async (req, res) => {
  await res.send({value: urls_controller.exist(res.body.value)});
});

app.get('/', async (req, res) => {
  console.log("oi");
});

//const rogerio = new App;
//rogerio.execute();

