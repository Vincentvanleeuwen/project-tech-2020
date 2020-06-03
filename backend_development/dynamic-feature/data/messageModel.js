const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sendFrom: String,
  sendTo: String,
  message: String,
  date: String,
  receiver: String
}, {collection: 'messages'});

messageSchema.statics = {

  getMessages: (messages, sender, receiver) => {

    console.log('messageModel', messages, sender, receiver);
    return messages.filter(message => {

      if (message.sendFrom === sender && message.sendTo === receiver) {

        return message;

      }

    })

  }

};
const Message = mongoose.model('messageModel', messageSchema);

module.exports =  Message;