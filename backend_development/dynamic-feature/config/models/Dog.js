const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dogSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  toy: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  personality: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],

});



dogSchema.pre('save', async (next) => {

  const dog = this;

  if(dog.isModified('password')) {
    dog.password = await bcrypt.hash(user.password, 10);
  }

  next();

});

dogSchema.methods = {

  checkPassword: (inputPassword) => {
    return bcrypt.compareSync(inputPassword, this.password);
  },

  hashPassword: (plainPassword) => {
    return bcrypt.hashSync(plainPassword, 10);
  }

};

// const dogSchema = mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   dogName: {
//     type: String,
//     required: true
//   },
//   images: {
//     type: Array,
//     required: false
//   },
//   breed: {
//     type: String,
//     required: true
//   },
//   favToy: {
//     type: String,
//     required: true
//   },
//   age: {
//     type: Number,
//     required: true
//   },
//   personality: {
//     type: String,
//     required: true
//   },
//
//   status: String,
//   lastMessage: String,
//   description: String,
//   matches: Array
// });
const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;