// Get Express
const express = require('express');
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
  dogMatches
} = require('./public/utils/matching');


require('dotenv').config();

const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');


// let hardCodedUser = "bobby@gmail.com";
let db;

function dogVariables(dogs, req, res, next) {

  req.session.user = {email: "bobby@gmail.com"};

  req.matches = dogMatches(dogs, req.session.user); // TypeError: Cannot set property 'matches' of undefined
  req.selected = selectedConversation(dogs, req.session.user);
  next()
}

function initializeSocketIO(req, res, next) {
  // Initialize Socket.io
  io.sockets.on('connection', socket => {
    socket.username = 'anon';


    socket.on('match-room', data => {
      socket.join(data.email);
    });

    socket.on('dog-message', message => {
      socket.broadcast.emit('message', message);
    });
    socket.on('typing', data => {
      socket.broadcast.emit('typing', {username: socket.username})
    });

    socket.on('chat-index', index => {
      chatIndex = index;
      console.log("chatindex in app.js = ", chatIndex);

    });

  });
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
    .use(function(req, res, next) {
      app.locals.expreq = req;
      next();
    })
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

    initializeSocketIO();

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

    console.log(`Connected!`)
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
  //   email: 'testdog@dog.com',
  //   name: 'testie',
  //   images: ['test.jpg'],
  //   status: 'Test status',
  //   lastMessage: 'Example test',
  //   description: 'Test Example',
  //   breed: 'TestBreed',
  //   favToy: 'Testtoy',
  //   age: '7',
  //   personality: 'cool',
  //   matches: ['bobby@gmail.com']
  // });



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







