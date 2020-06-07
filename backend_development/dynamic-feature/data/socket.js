const sharedSessions = require('express-socket.io-session');
const Message = require('./messageModel');
const Dog = require('./dogModel');

const initializeSocketIO = (server, newSession) => {

  const io = require('socket.io')(server);
  let room;

  io.use(sharedSessions(newSession));

  // Initialize Socket.io
  io.sockets.on('connection', socket => {

    // Save message to database
    socket.on('message-to-db',(message) => {

      // Push new message to the database
      Message.create([{
        sendFrom: socket.handshake.session.user.email,
        sendTo: socket.handshake.session.selected.email,
        message: message.message,
        receiver: socket.handshake.session.user.email,
        date: message.date
      }]);

    });

    // When user clicks block (socket.emit @default.js)
    socket.on('delete-message', (id) => {

      console.log('delete', id);

      Message.deleteOne({'_id': id}, err => {

        if(err) throw err;
        console.log('Succesfully deleted.');

      });

    });

    // Unfinished Socket function.
    socket.on('match-room', roomID => {

      if(socket.roomID) {

        console.log('Left the socket!', socket.roomID);

        socket.leave(socket.roomID);

      }

      room = roomID;

      socket.join(room);

    });

    // When a dog submits a message
    socket.on('dog-message', (id, message) => {

      socket.broadcast.to(id).emit('message', message);

    });

    // When a dog is typing, show it to the other dog.
    socket.on('typing', () => {

      socket.broadcast.emit('typing', {username: socket.handshake.session.user.name});

    });

    // When user clicks on block this dog, block the dog
    socket.on('block-user', email => {

      let currentDog = Dog.getDogFromEmail(socket.handshake.session.allDogs, socket.handshake.session.user);

      console.log('blocked user = ', email);
      console.log('current user = ', socket.handshake.session.user);

      socket.handshake.session.user.matches = Dog.blockMatch(email, currentDog[0].matches);

      // Update matches
      Dog.updateDog(socket.handshake.session.user)
      .then(result => console.log("result is", result))
      .catch(err => console.log(err));


    });

    // When a chat is opened, change req.session.selected to new dog
    socket.on('chat-index', index => {

      // Change the selected chat
      socket.handshake.session.selected = Dog.selectedConversation(socket.handshake.session.allDogs,socket.handshake.session.user, index);
      socket.handshake.session.save();

    });

  });

};

module.exports = { initializeSocketIO };