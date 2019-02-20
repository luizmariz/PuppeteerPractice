const cors = require('cors');
const express = require('express');
const urls_controller = require('./controllers/urls_controller');

const app = express();

app.use(express.static('public'))
app.use(express.json());
app.use(cors())

app.listen(3000, function () {
  console.log('rogerio listening on port 3000!');
});

app.post('/create', async (req, res) => {
  await urls_controller.create(req.body.value);
  console.log("salvei")
  res.send("saved!");
});

app.post('/exists', async (req, res) => {
  const boolean = await urls_controller.exist(req.body.value);
  console.log(boolean);
  res.send({ value: boolean });
});