const router = require('express').Router();

// Show your matches on http://localhost:4000/matches
router.get('/', (req, res) => {

  // console.log('session /matches.js ', req.session);
  console.log('selected user ', req.session.selected); // UNDEFINED
  // console.log('/matches matches', req.session.matches); // [{match},{match},{match}]

  res.render('matches', {

    title: 'Your Matches',
    style: 'matches.css',
    match: req.session.matches,
    selected: req.session.selected,
    user: req.session.user

  });

});

router.post('/', (req, res) => {

  console.log(req.body.email);

  res.render('matches', {

    title: 'Logged in as ' + req.body.name,
    style: 'matches.css',
    match: req.session.matches,
    selected: req.session.selected,
    user: req.body.email

  });

});

// Export the router so it can be required in other files.
module.exports = router;
