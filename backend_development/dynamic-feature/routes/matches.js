const router = require('express').Router();

// Show match page on http://localhost:4000/
router.get('/', (req, res) => {
  res.render('matches', {
    dogName: "Bobby"
  });
});

// Export the router so it can be required in other files.
module.exports = router;
