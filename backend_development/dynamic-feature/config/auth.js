const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = (req, res, next) => {

  const token = req.cookies.token || req.headers['token'];

  if (!token) {

    req.dog = null;
    next();

  }
  else {

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {

      if (err) {
        req.user = null;
        next()
      }

      req.dog = decoded;
      next()

    })
  }

};

module.exports = auth;