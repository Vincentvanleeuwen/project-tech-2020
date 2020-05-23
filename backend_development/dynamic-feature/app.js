// Get Express
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);

const port = 4000 || process.env.PORT;

// Require the routes
let home = require('./routes/home');
let matches = require('./routes/matches');

const dogs = [
  {
    name: 'Bobby',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'New message',
    lastMessage: 'Hello How r u',
    description: 'Bobby is always such a happy dog! He likes to eat (literally everything). He loves meeting new friends and that\'s why he is here! He can play with all the dogs, hes a very charming guy.',
    breed: 'Labrador/Beagle mix',
    favToy: 'Tennis Ball',
    age: "8",
    personality: "Hungry & Playful"

  },
  {
    name: 'Bobo',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'New message',
    lastMessage: 'Hello How r u'
  },
  {
    name: 'Bongy',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'New message',
    lastMessage: 'Hello How r u'
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


// Listen on http://localhost:4000
server.listen(port, () => console.log("Running on Port", port));






