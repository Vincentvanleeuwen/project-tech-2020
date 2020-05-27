function dogMatches(dogs) {

  let loggedInDog = dogs[0];

  // Check if a dog is a match
  return dogs.filter( dog => {
      if (loggedInDog.matches.includes(dog.email)) {
        return dog;
      } else {
        console.log("Could not find any matches.");
      }
  });

}


function selectedConversation(dogs) {

  // Get first dog in array to open instantly.
  return dogMatches(dogs)[0].images;

  // More soon...
  // let index = Array.from(document.getElementsByClassName('single-matches')).indexOf('.active-chat');
}

module.exports = {
  selectedConversation,
  dogMatches
};