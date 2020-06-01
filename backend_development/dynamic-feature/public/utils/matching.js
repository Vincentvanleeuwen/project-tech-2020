// Get all the current dog's matches and put them in an array.
function dogMatches(dogs, currentDog) {

  // Get the logged in dog object
  let loggedInDog = getDogFromEmail(dogs, currentDog);

  // Check if logged in dog has matches, return those dogs
  return dogs.filter( dog => {


      if (loggedInDog[0].matches.includes(dog.email)) {

        return dog;

      } else {

        // console.log(`${loggedInDog[0].email} does not match with ${dog.email}.`);

      }

  });

}


// Compare current dog's email with a dog that's in the database and return this dog.
function getDogFromEmail(dogs, currentDog) {
  console.log('dogs= ', dogs);
  return dogs.filter( dog => {

    if (dog.email === currentDog.email) {

      return dog;

    }

  });

}

// Get the selected chat dog object
function selectedConversation(dogs, currentDog, index) {

  console.log('index =',index);

  // Get first dog in array to open instantly.
  return dogMatches(dogs, currentDog)[index];

}

// Export these functions
module.exports = {
  selectedConversation,
  dogMatches,
  getDogFromEmail
};