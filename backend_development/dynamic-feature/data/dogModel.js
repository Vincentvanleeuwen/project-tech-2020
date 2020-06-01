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

  blockMatch: (dogs, data, selfMatches) => {
    console.log('block1', data);
    console.log('block2', selfMatches);

    let filterMatches = dogs.filter(dog => {
      console.log(selfMatches);
      selfMatches.includes(dog.email);

      return dog;

    });
    console.log('block3', filterMatches);
    return filterMatches.filter(block => {
      if (block !== data) {
        return block;
      }
    })

  },

  dogMatches: (dogs, currentDog) => {

    // Get the logged in dog object
    let loggedInDog = Dog.getDogFromEmail(dogs, currentDog);

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

  selectedConversation: (dogs, currentDog, index) => {

    console.log('index =',index);

    // Get first dog in array to open instantly.
    return Dog.dogMatches(dogs, currentDog)[index];

  }

};


const Dog = mongoose.model('dogModel', dogSchema);

module.exports =  Dog;

// await Dog.create({
//   email: 'bongie@dog.com',
//   name: 'Bongie',
//   images: ['bobby-old2.jpg'],
//   status: 'Test status',
//   lastMessage: 'Example test',
//   description: 'Test Example',
//   breed: 'TestBreed',
//   favToy: 'Testtoy',
//   age: '7',
//   personality: 'cool',
//   matches: ['bungie@dog.com', 'bango@dog.com']
// });
// await Dog.create({
//   email: 'bungie@dog.com',
//   name: 'Bungie',
//   images: ['bobby-old2.jpg'],
//   status: 'Test status',
//   lastMessage: 'Example test',
//   description: 'Test Example',
//   breed: 'TestBreed',
//   favToy: 'Testtoy',
//   age: '7',
//   personality: 'cool',
//   matches: ['bongie@dog.com', 'bango@dog.com']
// });
// await Dog.create({
//   email: 'bango@dog.com',
//   name: 'Bango',
//   images: ['bobby-old2.jpg'],
//   status: 'Test status',
//   lastMessage: 'Example test',
//   description: 'Test Example',
//   breed: 'TestBreed',
//   favToy: 'Testtoy',
//   age: '7',
//   personality: 'cool',
//   matches: ['bungie@dog.com', 'bongie@dog.com']
// });
//