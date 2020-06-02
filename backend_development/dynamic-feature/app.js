'use strict';

// Get Express
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sharedSessions = require('express-socket.io-session');
const cookieParser = require('cookie-parser');
const Dog = require('./data/dogModel');

require('dotenv').config();
const port = 4000 || process.env.PORT;
let db;

// Initialize MongoDB
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {

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

let chatIndex = 0;
let hardCodedUser = 'bobby@gmail.com';


// Assign handlebars as the view engine
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
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
  dogVariables,
  home
)

// Show all matches & chats
.use('/matches',
  dogVariables,
  matches
);
// Once all the dogs are received, start express

// See all the dogs


io.use(sharedSessions(newSession));

// Initialize Socket.io
io.sockets.on('connection', socket => {

  socket.emit('sessiondata', socket.handshake.session);

  console.log('hello', socket.handshake.session.username);
  // console.log('session', socket.handshake.session);

  socket.on('login', (dogData) => {

    socket.handshake.session.dogdata = dogData;
    socket.handshake.session.save();

  });

  socket.on('logout', (dogData) => {

    if (socket.handshake.session.dogdata) {
      delete socket.handshake.session.dogdata;
      socket.handshake.session.save();
    }

  });

  // console.log('socket=', socket);
  // socket.user = ;

  // console.log('username: ', req.session);

  socket.on('match-room', data => {

    socket.join(data.email);

  });

  // When a dog submits a message
  socket.on('dog-message', message => {

    socket.broadcast.emit('message', message);

  });

  // When a dog is typing, show it to the other dog.
  socket.on('typing', data => {

    socket.broadcast.emit('typing', {username: socket.user});
    console.log('isTyping=', data);

  });

  // When user clicks on block this dog, block the dog
  socket.on('block-user', email => {

    let currentDog = Dog.getDogFromEmail(socket.handshake.session.allDogs, socket.handshake.session.user);
    console.log('blocked user = ', email);
    console.log('current user = ', socket.handshake.session.user);

    let newMatches = Dog.blockMatch(email, currentDog[0].matches);

    async function updateDog() {
      return await Dog.updateOne(
        {'email': socket.handshake.session.user.email},
        {matches: newMatches}
      );
    }
    updateDog();
    console.log('newMathces = ', newMatches);

    // socket.broadcast.emit('block-user', {matches: newMatches});


  });

  // When a chat is opened, change req.session.selected to new dog
  socket.on('chat-index', index => {

    socket.handshake.session.selected = Dog.selectedConversation(socket.handshake.session.allDogs,socket.handshake.session.user, index);

    console.log('req select', socket.handshake.session.selected); // Is the correct Object!

    socket.handshake.session.save();

  });

});

async function getDogs() {

  //just return the plain javascript object. instead of mongoose
  return await Dog.find().lean();

}

async function dogVariables(req, res, next) {

  const allDogs = await getDogs();
  req.session.user = {email: hardCodedUser};
  req.session.matches = Dog.dogMatches(allDogs, req.session.user);
  req.session.allDogs = allDogs;

  next();

}


// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));



