// const moment = require('moment');
const socket = io();
const chatContainer = document.querySelector('.chat-container');
const chatInput = document.getElementById('chat-input');
const chatBulbContainer = document.querySelector('.chat-bulbs');

socket.on('message', message => {
  if (message.length === 0) {
    console.log('Empty input');
  } else {
    addNewMessage(message);
    window.scrollTo(0,document.chatBulbContainer.scrollHeight);
  }
});

chatContainer.addEventListener('submit', e => {
  e.preventDefault();
  const message = chatInput.value;

  if (message.length === 0) {
    console.log('Empty input');
  } else {
    addNewMessage(message, " self");
  }
  socket.emit('dog-message', message);

  // Clear the input when someone sends their message
  chatInput.value = '';
});

function addNewMessage(message, receiver) {

  const chatBulb = document.createElement('div');
  chatBulb.classList += " single-bulb";
  if(receiver){
    chatBulb.classList += `${receiver}`;
  }


  const bulb = document.createElement('div');
  bulb.classList += "bulb ";

  const bulbContent = document.createElement('div');
  bulbContent.classList += "bulb-content ";

  const bulbTime = document.createElement('span');
  bulbTime.classList += "bulb-timestamp ";

  bulbContent.innerText = message;
  bulbTime.innerText = new Date().toLocaleTimeString('en-GB', { hour: "numeric",
    minute: "numeric"});
  chatBulb.appendChild(bulb);
  bulb.appendChild(bulbContent);
  bulb.appendChild(bulbTime);

  chatBulbContainer.appendChild(chatBulb);
}

