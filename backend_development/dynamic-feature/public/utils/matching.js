const dogs = require("../../data/dogs.json");

function dogMatches() {

  let loggedInDog = dogs.dogs[0];

  // console.log('loggedindog=', dogArray[0] );
  // Check if a dog is a match
  filteredDogs = dogs.dogs.filter( dog => {

      // console.log('singledog', Object.keys(dog)[0]);
      // console.log('Matches ',loggedInDog['matches']);

      if (loggedInDog.matches.includes(dog.email)) {
        return dog;
      } else {
        console.log("Could not find any matches.");
      }
  });
  // console.log('filtered dog returns ', filteredDogs);
  console.log(filteredDogs);
  return filteredDogs;

}

function requestMatches(req, res, next) {
  // Give function to children
  req.requestMatches = dogMatches();
  next()
}

function selectedConversation(req, res, next) {
  // Get first dog in array to open instantly.
  console.log('Dogmatchie', dogMatches());
  selectedDog = dogMatches()[0].images;

  // More soon...
  // let index = Array.from(document.getElementsByClassName('single-matches')).indexOf('.active-chat');


  // Give function to children
  req.selectedDog = selectedDog;
  next()
}


module.exports = {
  requestMatches,
  selectedConversation,
  dogMatches
};