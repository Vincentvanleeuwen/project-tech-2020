const router = require('express').Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Dog = require('../config/models/Dog');
const auth = require('../config/auth');
require('dotenv').config();

let refreshTokens = [];

router.use((req, res, next) =>{
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});
// Show all the dogs on localhost:4000/
router.get('/', auth, async (req, res) => {
  try {
    const dog = await Dog.findById(req.dog.id);



      console.log('Router Dog = ', console.log(dog));
      console.log('Router Dog = ', console.log(err));
      console.log('Router Dog = ', console.log(authorizedData));

      res.render('home', {

        title: 'My Profile',
        style: 'match.css',
        dog: dog

      });



  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }


});

router.get('/signup', async (req, res) => {
  try {

    res.render('signup', {

      title: 'Sign up',
      style: 'form.css',

    });

  } catch (err) {

    console.log(err);

  }
});

router.get('/login', async (req, res) => {
  try {
    console.log(req.dog);
    res.render('login', {

      title: 'Sign up',
      style: 'form.css',

    });

  } catch (err) {

    console.log(err);

  }
});

router.post(
  '/signup',
  [
    check('name', 'You have not entered a username yet!').not().isEmpty(),
    check('email', 'Enter a valid email.').isEmail(),
    check('password', 'Minimum 6 characters').isLength({
      min: 6
    }),
    check('images', 'No picture selected').not().isEmpty(),
    check('breed', 'You have not entered a breed yet!').not().isEmpty(),
    check('toy', 'You have not entered a toy yet!').not().isEmpty(),
    check('age', 'You have not entered an age yet!').not().isEmpty(),
    check('personality', 'You have not entered a personality yet!').not().isEmpty(),
    check('description', 'You have not entered a description yet!').not().isEmpty()
  ],
  (req, res) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {

      return res.status(400).json({

        errors: validationErrors.array()

      });

    }

    const {
      name,
      email,
      password,
      images,
      breed,
      age,
      personality,
      toy,
      description
    } = req.body;


    Dog.find({ email }, (err, match) => {
      if (err) {
        return res.json({error: true, errMsgs: ['Error in finding User']})
      } else if (match.length !== 0) {
        return res.json({error: true, errMsgs: ['Already a user with that username']})
      }

        // 3. Create the new user!
      const dogData = new Dog({
          name,
          email,
          password,
          images,
          breed,
          age,
          personality,
          toy,
          description
      });

        // 4. Save to the database
      dogData.save((err) => {
        console.log('saving ...');
          if (err) {
            return res.json({error: true, errMsgs: ['Saving Error']})
          }
      return res.json({ success: true })
      })
    });

  }
);

router.post(
  '/login',
  [

    check('email', 'Enter a valid email.').isEmail(),
    check('password', 'Minimum 6 characters').isLength({
      min: 6
    })

  ],
  (req, res) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {

      return res.status(400).json({

        errors: validationErrors.array()

      });

    }

    const {
      email,
      password
    } = req.body;



    Dog.findOne({ email }, (err, userMatch) => {

      console.log('userMatch: ', userMatch);

      if (err || userMatch === null) {

        return res.json({error: true, errMsgs: ['No userMatch for that username']});

      } else if (!userMatch.checkPassword(password)) {

        return res.json({error: true, errMsgs: ['Password is incorrect']});

      } else {

        const payload = {
          _id: userMatch._id,
          email: userMatch.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // expires in 1 hour
        };

        const token = jwt.sign(payload, process.env.TOKEN);


        const options = {
          httpOnly: true
        };

        res.cookie('token', token, options);
        res.json({success: true, msg: 'you are signed in'});

      }
    })
  }
);

// logout route with cookies now!
router.post('/logout', (req, res) => {

  res.clearCookie('token')
  res.json({msg: 'you are logged out now'})

});

module.exports = router;
