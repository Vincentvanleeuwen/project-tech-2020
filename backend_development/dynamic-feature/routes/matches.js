const router = require('express').Router();

// Show your matches on http://localhost:4000/matches
router.get('/', (req, res) => {
  res.render('matches', {
    title: 'Your Matches',
    style: 'matches.css',
    match: req.requestMatches,
    selected: req.selectedDog
  });
});

// Export the router so it can be required in other files.
module.exports = router;
