const express = require('express');
const app = express();
const bodyParser   = require('body-parser');
const fs = require('fs');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index.ejs');
});
app.listen(3000, function () {
  console.log('We on port 3000 with it!');
});
