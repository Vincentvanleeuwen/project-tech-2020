// Get Express
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

// Require Utilities
const {
  selectedConversation,
  requestMatches,
  dogMatches
} = require('./public/utils/matching');


require('dotenv').config();

const port = 4000 || process.env.PORT;
// const dogs = require('./data/dogs.json');

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');

let message = mongoose.model('Message', {
  name: String,
  time: String
});

let db = null;
const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;


// fs.readFile(__dirname + '/data/dogs.txt', 'utf-8', (err, dogs) => {
//   if (err) throw err;
//   console.log(dogs);
//   allDogs = dogs;
// });

// Assign handlebars as the view engine
app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
  }))
  .set('view engine', 'hbs')

// Create a Route
  .use('/public', express.static('public'))

  .use(requestMatches, selectedConversation)

// See all the dogs
  .use('/', home)

// Create a profile
  .use('/matches', matches);

io.sockets.on('connection', socket => {
  socket.username = "Anon";

  socket.on('match-room', data => {
    socket.join(data.email);
  });

  socket.on('dog-message', message => {
    socket.broadcast.emit('message', message);
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', {username: socket.username})
  });


});

// mongoose.connect(dbUrl,  {useNewUrlParser: true});
// mongoose.connection.on('error', err => `MongoDB connection error: ${err}`);

// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));






