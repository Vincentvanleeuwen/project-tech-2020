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


dogSchema.statics = {

  blockMatch: (match, currentDog) => {

    console.log('blockFunction =', match, currentDog);
    return currentDog.filter(dog => {
      if (dog !== match) {
        return dog;
      }
    });
  },

  dogMatches: (dogs, currentDog) => {

    // Get the logged in dog object
    let loggedInDog = mongoose.model('dogModel', dogSchema).getDogFromEmail(dogs, currentDog);

    // Check if logged in dog has matches, return those dogs
    return dogs.filter(dog => {

      if (loggedInDog[0].matches.includes(dog.email)) {

        return dog;

      }

    });
  },

  getDogFromEmail: (dogs, currentDog) => {

    return dogs.filter( dog => {

      if (dog.email === currentDog.email) {

        return dog;

      }

    });

  },

  selectedConversation(dogs, currentDog, index) {

    console.log('index =',index);

    // Get first dog in array to open instantly.
    return mongoose.model('dogModel', dogSchema).dogMatches(dogs, currentDog)[index];

  }
};


const Dog = mongoose.model('dogModel', dogSchema);

module.exports =  Dog;