

const dogs = [
  {
    id: 0,
    email: 'bobby@gmail.com',
    name: 'Bobby',
    images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: 'New message',
    lastMessage: 'Hello How r u',
    description: 'Bobby is always such a happy dog! He likes to eat (literally everything). He loves meeting new friends and that\'s why he is here! He can play with all the dogs, hes a very charming guy.',
    breed: 'Labrador/Beagle mix',
    favToy: 'Tennis Ball',
    age: "8",
    personality: "Hungry & Playful",
    matches: [1,2,3]
  },
  {
    id: 1,
    email: 'bobo@yahoo.com',
    name: 'Bobo',
    images: ['bobby-pup2.jpg', 'bobby-pup.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
    status: '5 new messages',
    lastMessage: 'Holo',
    description: 'Bobo make friend',
    breed: 'Bulldog',
    favToy: 'Your leg',
    age: "5",
    personality: "Active & Goofy",
    matches: [2]
  },
  {
    id: 2,
    email: 'bongy@bing.com',
    name: 'Bongy',
    images: ['bobby-old.jpeg', 'bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old2.jpg'],
    status: 'Old message',
    lastMessage: 'Heyyyyyy',
    description: 'Very big chungus',
    breed: 'Samoyed',
    favToy: 'Squishy toy',
    age: "3",
    personality: "Energetic & Sweet",
    matches: [0]
  },
  {
    id: 3,
    email: 'bungo@bing.com',
    name: 'Bungo',
    images: ['bobby-old2.jpg', 'bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg'],
    status: 'Old message',
    lastMessage: 'Wow thats cool',
    description: 'Cool bean',
    breed: 'Samoyed',
    favToy: 'Squishy toy',
    age: "3",
    personality: "Energetic & Sweet",
    matches: [0]
  }
];

function dogMatches() {

  let loggedInDog = dogs[0];

  // Check if a dog is a match
  filteredDogs = [...dogs].filter(dog => {
    if (loggedInDog.matches.includes(dog.id)) {
      return dog;
    }
  });

  return filteredDogs;
}

function requestMatches(req, res, next) {
  // Give function to children
  req.requestMatches = dogMatches;
  next()
}

function selectedConversation(req, res, next) {
  // Get first dog in array to open instantly.
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