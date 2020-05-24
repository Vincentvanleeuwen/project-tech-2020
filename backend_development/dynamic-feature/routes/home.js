const router = require('express').Router();

// Show all the dogs on localhost:4000/
router.get('/', (req, res) => {
  res.render('home', {
    title: 'Match a dog!',
    style: 'match.css',
    match: req.requestMatches
  });
});


module.exports = router;
