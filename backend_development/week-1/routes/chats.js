const router = require('express').Router();

router.use(logThatTime = (req, res, next) => {
  // Shows the time upon page load
  console.log('Time: ', Date.now());
  next();
});

// Show all the dogs on localhost:4000/
router.get('/', (req, res) => {
  res.render('home', {
    dogName: "Bobby"
  });
});

router.get('/search', (req, res) => {
  console.log(req.protocol);     // "http"
  console.log(req.hostname);     // "localhost"
  console.log(req.path);         // "/search"
  console.log(req.originalUrl);  // "/search"
  console.log(req.subdomains);   // in this case []
});
// Show the about me on localhost:4000/about
router.get('/about', (req, res) => {
  res.send('About the app');
});

// Get a specific ID, https://localhost:4000/50/about, 50 is the ID
router.get('/:id/about', (req, res) => {
  res.send("Doggies");
});

module.exports = router;
