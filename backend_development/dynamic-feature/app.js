// Get Express
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');

// Require Utilities
const {
  selectedConversation,
  dogMatches,
  requestMatches
} = require('./public/utils/matching');




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

// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));






