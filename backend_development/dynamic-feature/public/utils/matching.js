function dogMatches(dogs, currentDog) {

  // Get the logged in dog object
  let loggedInDog = dogs.filter( dog => {
    if (dog.email === currentDog.email) {
      return dog;
    }
  });

  // Check if logged in dog has matches, return those dogs
  return dogs.filter( dog => {
      if (loggedInDog[0].matches.includes(dog.email)) {
        return dog;
      } else {
        console.log(`${loggedInDog[0].email} does not match with ${dog.email}.`);
      }
  });

}


function selectedConversation(dogs, currentDog) {

  // Get first dog in array to open instantly.
  return dogMatches(dogs, currentDog);

  // More soon...
  // let index = Array.from(document.getElementsByClassName('single-matches')).indexOf('.active-chat');
}

module.exports = {
  selectedConversation,
  dogMatches
};