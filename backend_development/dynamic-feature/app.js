// Get Express
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);

const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');

const name = "Bobby";

// Asign handlebars as the engine
app
  .engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
  }))
  .set('view engine', 'hbs')

// Create a Route
  .use('/public', express.static('public'))

// See all the dogs
  .use('/', home)

// Create a profile
  .use('/matches', matches);



// Listen on http://localhost:4000
server.listen(port, () => console.log("Running on Port", port));






