const router = require('express').Router();

// Show all the dogs on localhost:4000/
router.get('/', (req, res) => {

  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dog: req.thisDogObject

  });

});



module.exports = router;
