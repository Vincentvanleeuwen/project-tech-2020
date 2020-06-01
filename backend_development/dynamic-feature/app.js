"use strict";

// Get Express
const express = require('express');
const bodyParser = require("body-parser");
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

console.log(Dog);


require('dotenv').config();

const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');


let hardCodedUser = 'bobby@gmail.com';
let db;


function dogVariables(dogs, req, res, next) {

  req.session.user = {email: hardCodedUser};
  req.session.matches = Dog.dogMatches(dogs, req.session.user);
  req.session.allDogs = dogs;

  next();

}



runMongo()
  .then(dogs => {

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
    .use(session({
      name: 'sid', // Session ID
      resave: false, // Don't send data back to the store
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
        sameSite: true,
        secure: false,
        creationDate: Date.now()
      },
      store: new MongoStore({ mongooseConnection: db })
    }))

    // Make files public
    .use('/public', express.static('public'))

    // Supports parsing of Json
    .use(bodyParser.json())

    // Supports parsing of x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: true }))

    .use((req, res, next) => initializeSocketIO(dogs, req, res, next))

    // See all the dogs
    .use('/',
      (req, res, next) => dogVariables(dogs, req, res, next),
      home
    )

    // Show all matches & chats
    .use('/matches',
      (req, res, next) => dogVariables(dogs, req, res, next),
      matches
    );


    // Listen on http://localhost:4000
    server.listen(port, () => console.log('Running on Port', port));


  })
  .catch(error => console.log(error.stack));



async function runMongo() {

  const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

  await mongoose.connect(dbUrl,  {

    useNewUrlParser: true,
    useUnifiedTopology: true,

  });

  db = mongoose.connection;

  db.on('connected', () => {

    console.log(db);
    console.log(`Connected!`);

  });

  db.on('error', err => console.log(`MongoDB connection error: ${err}`));

  return await Dog.find().lean();

}



// // Saving data to database
// const message = {
//   from: 'bobby@gmail.com'
//   to: 'bungo@bing.com'
//   message: 'testdog@dog.com',
//   time: 'testie',
// };
// const newMessage = new messageModel(message);

// newMessage.save((err) => {
//   if (err) throw err;
//   else console.log("Saved Message");
// });


let chatIndex = 0;


function initializeSocketIO(dogs, req, res, next) {

  // req.session.selected = Dog.selectedConversation(dogs, req.session.user, chatIndex);

  io.use(sharedSessions(session({
    name: 'sid', // Session ID
    resave: false, // Don't send data back to the store
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
      sameSite: true,
      secure: false
    },
    store: new MongoStore({ mongooseConnection: db })
  })));

  // Initialize Socket.io
  io.sockets.on('connection', socket => {

    console.log("hello", socket.username);
    console.log("session", socket.request.session);

    socket.on('login', (dogData) => {

      socket.handshake.session.dogdata = dogData;
      socket.handshake.session.save();

    });

    socket.on('logout', (dogData) => {

      if(socket.handshake.session.dogdata) {
        delete socket.handshake.session.dogdata;
        socket.handshake.session.save();
      }

    });

    // console.log('socket=', socket);
    socket.user = req.session.user;

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
      console.log(data);

    });

    // When user clicks on block this dog, block the dog
    socket.on('block-user', data => {

      let currentDog = Dog.getDogFromEmail(dogs, socket.user);
      console.log('blocked user = ', data);

      let newMatches = Dog.blockMatch(dogs, data, currentDog[0].matches);

      console.log('newMathces = ', newMatches);

      socket.broadcast.emit('block-user', {matches: newMatches});

      // Dog({email: socket.user.email}, {matches: newMatches});

    });

    // When a chat is opened, change req.session.selected to new dog
    socket.on('chat-index', index => {

        req.session.selected = Dog.selectedConversation(dogs, req.session.user, index);
        console.log('req select', req.session.selected);


    });

  });

  next();

}

