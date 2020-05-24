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

const dogs = [
  {
    id: 0,
    name: 'Bobby',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'New message',
    lastMessage: 'Hello How r u',
    description: 'Bobby is always such a happy dog! He likes to eat (literally everything). He loves meeting new friends and that\'s why he is here! He can play with all the dogs, hes a very charming guy.',
    breed: 'Labrador/Beagle mix',
    favToy: 'Tennis Ball',
    age: "8",
    personality: "Hungry & Playful",
    matches: [2]
  },
  {
    id: 1,
    name: 'Bobo',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: '5 New messages',
    lastMessage: 'Holo',
    description: 'Bobo make friend',
    breed: 'Bulldog',
    favToy: 'Your leg',
    age: "5",
    personality: "Active & Goofy",
    matches: [2]
  },
  {
    id: 2,
    name: 'Bongy',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'Old message',
    lastMessage: 'Heyyyyyy',
    description: 'Very big chungus',
    breed: 'Samoyed',
    favToy: 'Squishy toy',
    age: "3",
    personality: "Energetic & Sweet",
    matches: [0, 1]
  }
];
var requestDogs = function (req, res, next) {
  req.requestDogs = dogs;
  next()
};
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

  .use(requestDogs)

// See all the dogs
  .use('/', home)

// Create a profile
  .use('/matches', matches);

io.sockets.on('connection', socket => {
  socket.on('dog-message', message => {
    socket.broadcast.emit('message', message);
  })
});

// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));






