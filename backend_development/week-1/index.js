// Get Express
let express = require('express');
let app = express();

// Get result from dogs
let dogs = require('./routes/dogs');
let profile = require('./routes/profile');
const name = "Bobby";
// Create a Route
app.use(express.static('pages'));

// See all the dogs
app.use('/', dogs);

// Create a profile
app.use('/' + name + '/', profile);


// Listen on http://localhost:4000
app.listen(4000, () => {
  console.log("Running on Port 4000");
});


