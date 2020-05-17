const router = require('express').Router();
const favouritePage = require('../views/favourite-page');

router.use(logThatTime = (req, res, next) => {
  // Shows the time upon page load
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send("Bobbys Profile");
});

// Only shows the favourites of Bobby
router.get('/favourites', (req, res) => {
  res.send(favouritePage());
});

// Get a specific ID, https://localhost:4000/50/about, 50 is the ID
router.get('/:id/about', (req, res) => {
  res.send("Doggies");
  res.send('Bobbys Favourites');
});

// Exports the router so that app.js can require it.
module.exports = router;
