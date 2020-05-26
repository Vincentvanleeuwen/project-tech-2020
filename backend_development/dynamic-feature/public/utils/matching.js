// const dogs = require("../../data/dogs.json");

function dogMatches(dogs) {

  let loggedInDog = dogs[0];

  // console.log('loggedindog=', dogArray[0] );
  // Check if a dog is a match
  filteredDogs = dogs.filter( dog => {

      // console.log('singledog', Object.keys(dog)[0]);
      // console.log('Matches ',loggedInDog['matches']);

      if (loggedInDog.matches.includes(dog.email)) {
        return dog;
      } else {
        console.log("Could not find any matches.");
      }
  });

  return filteredDogs;
}


function selectedConversation(dogs) {

  // Get first dog in array to open instantly.
  selectedDog = dogMatches(dogs)[0].images;

  // More soon...
  // let index = Array.from(document.getElementsByClassName('single-matches')).indexOf('.active-chat');

}

module.exports = {
  selectedConversation,
  dogMatches
};