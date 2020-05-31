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

// Require Utilities
const {
  selectedConversation,
  dogMatches,
  getDogFromEmail
} = require('./public/utils/matching');


require('dotenv').config();

const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');


// let hardCodedUser = "bobby@gmail.com";
let db;
// let chatIndex = 0;

function dogVariables(dogs, req, res, next) {

  req.session.user = {email: 'bobby@gmail.com'};
  req.matches = dogMatches(dogs, req.session.user);
  req.thisDogObject = getDogFromEmail(dogs, req.session.user);
  // req.selected = selectedConversation(dogs, req.session.user, chatIndex);

  next();

}

function blockUser(dogs, data, selfMatches) {

  let filterMatches = dogs.filter(dog => {
    console.log(selfMatches);
     selfMatches.includes(dog.email);

     return dog;

  });

  return filterMatches.filter(block => {
    if (block === data) {
      return block;
    }
  })

}
function initializeSocketIO(dogs, req, res, next) {

  // req.session.selected = selectedConversation(dogs, req.session.user, chatIndex);


  // Initialize Socket.io
  io.sockets.on('connection', socket => {

    socket.username = req.session.user;
    console.log('username: ', req.session);

    socket.on('match-room', data => {

      socket.join(data.email);

    });

    // When a dog submits a message
    socket.on('dog-message', message => {

      socket.broadcast.emit('message', message);

    });

    // When a dog is typing, show it to the other dog.
    socket.on('typing', data => {

      socket.broadcast.emit('typing', {username: socket.username});
      console.log(data);

    });

    // When user clicks on block this dog, block the dog
    socket.on('block-user', data => {

      let currentDog = getDogFromEmail(dogs, socket.username);
      console.log('blocked user = ', blockUser(dogs, data, currentDog[0].matches));
      socket.broadcast.emit('block-user', {block: blockUser(dogs, data, currentDog[0].matches)});

    });

    // When a chat is opened, change req.session.selected to new dog
    socket.on('chat-index', index => {

      req.session.selected = selectedConversation(dogs, req.session.user, index);

      console.log('req select', req.session.selected);

    });

  });

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

    // Initialize a session
    .use(session({
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
    }))

    // Make files public
    .use('/public', express.static('public'))

    // Supports parsing of Json
    .use(bodyParser.json())

    // Supports parsing of x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: true }))

    // See all the dogs
    .use('/',
      (req, res, next) => dogVariables(dogs, req, res, next),
      home
    )

    // Show all matches & chats
    .use('/matches',
      (req, res, next) => initializeSocketIO(dogs, req, res, next),
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

  const Schema = mongoose.Schema;

  const dogSchema = new Schema({
    email: String,
    name: String,
    images: Array,
    status: String,
    lastMessage: String,
    description: String,
    breed: String,
    favToy: String,
    age: String,
    personality: String,
    matches: Array
  }, {collection: 'dogs'});
//
  const dog = mongoose.model('dogModel', dogSchema);

  // await dog.create({
  //   email: 'bobby@gmail.com',
  //   name: 'testie',
  //   images: ['bobby-pup2.jpg'],
  //   status: 'Test status',
  //   lastMessage: 'Example test',
  //   description: 'Test Example',
  //   breed: 'TestBreed',
  //   favToy: 'Testtoy',
  //   age: '7',
  //   personality: 'cool',
  //   matches: ['testdog@dog.com']
  // });
  //


  return await dog.find().lean();

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







