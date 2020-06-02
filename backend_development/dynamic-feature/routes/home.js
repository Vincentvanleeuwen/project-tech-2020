const router = require('express').Router();

// Show all the dogs on localhost:4000/
router.get('/', (req, res) => {

  console.log(' ----- Every log on home.js ----- ');
  console.log('All dogs ', req.session.allDogs);
  console.log(' ----- End logs on home.js ----- ');


  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});


router.post('/', (req, res) => {

  console.log(' ----- Every log on home.js ----- ');

  if (req.session.allDogs.length !== 1){
    req.session.allDogs.shift();
  }


  console.log('All dogs ', req.session.allDogs);

  console.log(' ----- End logs on home.js ----- ');

  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});

module.exports = router;
