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
function getDogFromEmail(dogs, currentDog) {

  return dogs.filter( dog => {

    if (dog.email === currentDog.email) {

      return dog;

    }

  });

}

function selectedConversation(dogs, currentDog, index) {

  console.log('index =',index);
  // console.log("dogobject =",dogMatches(dogs, currentDog)[index]);

  // Get first dog in array to open instantly.
  return dogMatches(dogs, currentDog)[index];

}

module.exports = {
  selectedConversation,
  dogMatches,
  getDogFromEmail
};