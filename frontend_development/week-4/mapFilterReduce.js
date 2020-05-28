const animals = [
  {
    name: 'Hansie',
    species: 'dog',
    cost: 45
  },
  {
    name: 'Joopie',
    species: 'dog',
    cost: 22
  },
  {
    name: 'Beppy',
    species: 'fish',
    cost: 10
  },
  {
    name: 'Sem',
    species: 'fish',
    cost: 10
  },
  {
    name: 'Lolita',
    species: 'dog',
    cost: 60
  },
  {
    name: 'Fluffybeans',
    species: 'pig',
    cost: 20
  },
  {
    name: 'BearFluf',
    species: 'pig',
    cost: 15
  },
  {
    name: 'Manke Neel',
    species: 'dog',
    cost: 1
  }
];
const mappedAnimals = animals.map(animal => animal.species);
console.log("mapped =", mappedAnimals);

const filteredAnimals = animals.filter(animal => animal.species === 'dog');
console.log("filtered =", filteredAnimals);

const reducedAnimals = animals.reduce((allAnimals, animal) => {
  console.log(allAnimals);
  if( animal.species in allAnimals) {
    allAnimals[animal.species]++;
  } else {
    allAnimals[animal.species] = 1;
  }

  return allAnimals;
});

console.log("reduced =", reducedAnimals);
