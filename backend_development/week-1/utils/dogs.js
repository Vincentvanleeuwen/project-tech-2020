const dogs = [];

function getCurrentDog(id) {
  return users.find(user => user.id === id);
}

function dogRuns(id) {
  const dogIndex = dogs.findIndex(dog => dog.id === id);

  if (index !== -1) return dogs.splice(index, 1)[0];
}

function getMatchRoom(room) {
  return dogs.filter(dog => dog.room === room)
}

module.exports = {
  getCurrentDog,
  dogRuns,
  getMatchRoom
};