const router = require('express').Router();

// Show your matches on http://localhost:4000/matches
router.get('/', (req, res) => {

  console.log('selected user ', req.session.selected);

  res.render('matches', {

    title: 'Your Matches',
    style: 'matches.css',
    match: req.matches,
    selected: req.session.selected,
    user: req.session.user

  });

});

router.post('/', (req, res) => {


  res.render('matches', {

    title: 'Your Matches',
    style: 'matches.css',
    match: req.matches,
    selected: req.session.selected,
    user: req.session.user

  });

});

// Export the router so it can be required in other files.
module.exports = router;
