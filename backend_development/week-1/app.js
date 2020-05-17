// Get Express
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = 4000 || process.env.PORT;
const formatMessage = require('./utils/messages');
const {
  getCurrentDog,
  dogRuns,
  getMatchRoom
} = require('./utils/dogs');
let users = [];
let connections = [];

// Get result from dogs
let chats = require('./routes/chats');
let profile = require('./routes/profile');

const name = "Bobby";
const botName = "Bobbybot";

app.engine('hbs', handlebars({extname: 'hbs'}));
app.set('view engine', 'hbs');
// Create a Route
app.use(express.static(path.join(__dirname, 'public')));

// See all the dogs
app.use('/', chats);

// Create a profile
app.use('/' + name + '/', profile);

// Connect a user with the socket
io.on('connection', (socket) => {
  console.log('A dog has joined the chat');
  connections.push(socket);
  socket.on('disconnect', data => {

  });
  socket.on('send message', data => {

  });

  socket.on('new user', (data, callback) => {

  });

  function updateUsers() {

  }

});


// Listen on http://localhost:4000
server.listen(port, () => console.log("Running on Port", port));






