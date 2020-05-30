const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

const runMongo = async () => {

  try {

    await mongoose.connect(dbUrl,  {

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true

    });

    console.log('Connected to database');

  }
  catch (err) {

    console.log(err);
    throw err;

  }


  // db = mongoose.connection;
  //
  // db.on('connected', () => {
  //
  //   console.log(db);
  //   console.log(`Connected!`);
  //
  // });
  //
  // db.on('error', err => console.log(`MongoDB connection error: ${err}`));


  // await dog.create({
  //   email: 'testdog@dog.com',
  //   name: 'testie',
  //   images: ['test.jpg'],
  //   status: 'Test status',
  //   lastMessage: 'Example test',
  //   description: 'Test Example',
  //   breed: 'TestBreed',
  //   favToy: 'Testtoy',
  //   age: '7',
  //   personality: 'cool',
  //   matches: ['bobby@gmail.com']
  // });



  // return await dog.find().lean();

};

module.exports = runMongo;