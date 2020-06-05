'use strict';

// Get Express
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const { notEqualCheck, equalCheck } = require('./public/utils/handleHelpers');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sharedSessions = require('express-socket.io-session');
const cookieParser = require('cookie-parser');

// Require the models
const Dog = require('./data/dogModel');
const Message = require('./data/messageModel');

// Make .env file usable
require('dotenv').config();

// Set the port
const port = 4000 || process.env.PORT;

let db;

// Initialize MongoDB
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

// Connect to the Database
mongoose.connect(dbUrl, {

  // Prevent connection error
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

db = mongoose.connection;

db.on('connected', () => {

  console.log(`Connected!`);

});

db.on('error', err => console.log(`MongoDB connection error: ${err}`));


// Define the session
let newSession = session({

  name: 'sid', // Session ID
  resave: false, // Don't send data back to the store
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    sameSite: true,
    secure: false
  },
  store: new MongoStore({mongooseConnection: db})

});


// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');


// Assign handlebars as the view engine
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    equal: equalCheck,
    notEqual: notEqualCheck
  }
}))
.set('view engine', 'hbs')

.use(cookieParser(process.env.SESSION_SECRET))

// Initialize a session
.use(newSession)

// Make files public
.use('/public', express.static('public'))

// Supports parsing of Json
.use(bodyParser.json())

// Supports parsing of x-www-form-urlencoded
.use(bodyParser.urlencoded({extended: true}))

.use('/',
  home
)

// Show all matches & chats
.use('/matches',
  dogVariables,
  matches
);


io.use(sharedSessions(newSession));

// Initialize Socket.io
io.sockets.on('connection', socket => {

  // Save message to database
  socket.on('message-to-db',(message) => {

    // Push new message to the database
    Message.create([{
      sendFrom: socket.handshake.session.user.email,
      sendTo: socket.handshake.session.selected.email,
      message: message.message,
      receiver: socket.handshake.session.user.email,
      date: message.date
    }]);

  });

  // When user clicks block (socket.emit @default.js)
  socket.on('delete-message', (id) => {

    console.log('delete', id);

    Message.deleteOne({'_id': id}, err => {

      if(err) throw err;
      console.log('Succesfully deleted.');

    });

  });

  // Unfinished Socket function.
  socket.on('match-room', data => {

    socket.join(data.email);

  });

  // When a dog submits a message
  socket.on('dog-message', message => {

    socket.broadcast.emit('message', message);

  });

  // When a dog is typing, show it to the other dog.
  socket.on('typing', () => {

    socket.broadcast.emit('typing', {username: socket.handshake.session.user.name});

  });

  // When user clicks on block this dog, block the dog
  socket.on('block-user', email => {

    let currentDog = Dog.getDogFromEmail(socket.handshake.session.allDogs, socket.handshake.session.user);

    console.log('blocked user = ', email);
    console.log('current user = ', socket.handshake.session.user);

    socket.handshake.session.user.matches = Dog.blockMatch(email, currentDog[0].matches);

    // Update matches
    Dog.updateDog(socket.handshake.session.user)
    .then(result => console.log("result is", result))
    .catch(err => console.log(err));


  });

  // When a chat is opened, change req.session.selected to new dog
  socket.on('chat-index', index => {

    // Change the selected chat
    socket.handshake.session.selected = Dog.selectedConversation(socket.handshake.session.allDogs,socket.handshake.session.user, index);
    socket.handshake.session.save();

  });

});



async function dogVariables(req, res, next) {

  // Get dogs collection & messages collection from mongoDB
  const allDogs = await Dog.getDogs();
  const allMessages = await Message.getAllMessages();

  // Set the session for this user
  req.session.user = {email: req.body.email, name: req.body.name};
  req.session.matches = Dog.dogMatches(allDogs, req.session.user);
  req.session.allDogs = allDogs;
  req.session.selected = Dog.selectedConversation(req.session.allDogs,req.session.user, 0);
  req.session.messages =  Message.getMessages(allMessages, req.session.user.email, req.session.selected.email);

  next();

}


// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));



