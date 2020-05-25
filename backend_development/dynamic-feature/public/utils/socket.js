
// const moment = require('moment');
const socket = io();
const chatContainer = document.querySelector('.chat-container');
const chatInput = document.getElementById('chat-input');
const chatBulbContainer = document.querySelector('.chat-bulbs');
const chatButtons = document.querySelectorAll('.single-match');

socket.on('message', message => {
  if (message.length === 0) {
    console.log('Empty input');
  } else {
    addNewMessage(message);
    document.querySelector('.is-typing').remove();
  }

});

chatInput.addEventListener('keypress', () => {
  socket.emit('typing');

});

socket.on('typing', data => {

  const isTyping = document.createElement('p');
  const typingMessage = document.createTextNode(`${data.username} is typing...`);
  isTyping.classList += " is-typing";
  isTyping.appendChild(typingMessage);

  if(!document.querySelector('.is-typing')) {
    chatContainer.appendChild(isTyping);
  }

});

chatContainer.addEventListener('submit', e => {
  e.preventDefault();
  const message = chatInput.value;

  if (message.length === 0) {
    console.log('Empty input');
  } else {
    addNewMessage(message, ' self');
  }
  socket.emit('dog-message', message);

  // Clear the input when someone sends their message
  chatInput.value = '';
});



if (chatButtons) {

  let currentlyActive = chatButtons[0];

  currentlyActive.classList.add('active-chat');

  chatButtons.forEach(button => {


    button.addEventListener('click', () => {

      currentlyActive.classList.remove('active-chat');
      button.classList.add('active-chat');
      currentlyActive = button;

      socket.emit('match-room', {email: 'bobby@gmail.com'});
      console.log("hello");

    });
  });

}


function addNewMessage(message, receiver) {

  const chatBulb = document.createElement('div');
  chatBulb.classList += ' single-bulb';
  if(receiver){
    chatBulb.classList += `${receiver}`;
  }

  const bulb = document.createElement('div');
  bulb.classList += 'bulb ';

  const bulbContent = document.createElement('div');
  bulbContent.classList += 'bulb-content ';

  const bulbTime = document.createElement('span');
  bulbTime.classList += 'bulb-timestamp ';

  bulbContent.innerText = message;
  bulbTime.innerText = new Date()
    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });

  chatBulb.appendChild(bulb);
  bulb.appendChild(bulbContent);
  bulb.appendChild(bulbTime);

  chatBulbContainer.appendChild(chatBulb);

  // Scroll to bottom to always see newest chat message
  chatBulbContainer.scrollTop = chatBulbContainer.scrollHeight - chatBulbContainer.clientHeight;
}
