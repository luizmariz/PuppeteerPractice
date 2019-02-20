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
  try {
    await urls_controller.create(req.body.value);
  } catch (err) {
    console.log("create error")
  }
  
  res.send("saved!");
});

app.post('/exists', async (req, res) => {
  
  try {
    const boolean = await urls_controller.exist(req.body.value);
    res.send({ value: boolean });
  } catch (err) {
    console.log("exists error")
  }
});