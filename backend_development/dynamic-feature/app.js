// Get Express
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoServer = require('./config/mongo');
const parseTokenCookie = require('./config/auth').parseTokenCookie;

// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// Require Utilities
// const {
//   selectedConversation,
//   dogMatches,
//   getDogFromEmail
// } = require('./public/utils/matching');


require('dotenv').config();

const port = 4000 || process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:4000'
};


// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');

mongoServer();

// // let hardCodedUser = "bobby@gmail.com";
// let db;
// // let chatIndex = 0;
//
// function dogVariables(dogs, req, res, next) {
//
//   req.session.user = {email: 'bobby@gmail.com'};
//   req.matches = dogMatches(dogs, req.session.user);
//   req.thisDogObject = getDogFromEmail(dogs, req.session.user);
//   // req.selected = selectedConversation(dogs, req.session.user, chatIndex);
//
//   next();
//
// }
//
// function initializeSocketIO(dogs, req, res, next) {
//
//   // req.session.selected = selectedConversation(dogs, req.session.user, chatIndex);
//
//   // Initialize Socket.io
//   io.sockets.on('connection', socket => {
//
//     socket.username = req.session.user;
//
//
//     socket.on('match-room', data => {
//
//       socket.join(data.email);
//
//     });
//
//     socket.on('dog-message', message => {
//
//       socket.broadcast.emit('message', message);
//
//     });
//
//     socket.on('typing', data => {
//
//       socket.broadcast.emit('typing', {username: socket.username});
//       console.log(data);
//
//     });
//
//     socket.on('chat-index', index => {
//
//       req.session.selected = selectedConversation(dogs, req.session.user, index);
//
//       console.log('req select', req.session.selected);
//
//     });
//
//   });
//
//   next();
//
// }

app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}))
.set('view engine', 'hbs')

.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))
.use(cookieParser())
.use(parseTokenCookie())
// // Initialize a session
// .use(session({
//   name: 'sid', // Session ID
//   resave: false, // Don't send data back to the store
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
//     sameSite: true,
//     secure: false
//   },
//   store: new MongoStore({ mongooseConnection: db })
// }))

// Make files public
.use('/public', express.static('public'))


// See all the dogs
.use('/',
  // (req, res, next) => dogVariables(dogs, req, res, next),
  home
);

// Show all matches & chats
// .use('/matches',
//   (req, res, next) => initializeSocketIO(dogs, req, res, next),
//   (req, res, next) => dogVariables(dogs, req, res, next),
//   matches
// );

// runMongo()
//   .then(dogs => {
//
//     // Assign handlebars as the view engine
//
//

    // Listen on http://localhost:4000
    server.listen(port, () => console.log('Running on Port', port));
//
//
//   })
//   .catch(error => console.log(error.stack));
//
//




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







