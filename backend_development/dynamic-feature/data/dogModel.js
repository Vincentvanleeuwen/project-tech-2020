const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dogSchema = new Schema({
  email: String,
  name: String,
  images: Array,
  status: String,
  lastMessage: String,
  description: String,
  breed: String,
  favToy: String,
  age: String,
  personality: String,
  matches: Array
}, {collection: 'dogs'});

module.exports =  mongoose.model('dogModel', dogSchema);