const router = require('express').Router();

// Show your matches on http://localhost:4000/matches
router.get('/', (req, res) => {
  console.log('index = ', req.chatIndex);
  console.log('matches = ', req.matches);
  console.log('selected = ', req.selected);
  res.render('matches', {
    title: 'Your Matches',
    style: 'matches.css',
    match: req.matches,
    selected: req.selected,
    index: req.chatIndex
  });
});

// Export the router so it can be required in other files.
module.exports = router;
