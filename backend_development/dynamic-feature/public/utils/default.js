/*eslint-disable */

const socket = io();

/*eslint-enable */

const chatContainer = document.querySelector('.chat-container');
const chatInput = document.getElementById('chat-input');
const chatBulbContainer = document.querySelector('.chat-bulbs');
const chatButtons = document.querySelectorAll('.single-match');

const dogSettingMenu = document.querySelector('.dropdown-menu');
const dogSettingButton = document.getElementsByClassName('dog-settings');

console.log("Show dogsettingbutton = ", dogSettingButton[0]);


// Toggles the dog chat info menu
if(dogSettingButton[0]) {
  dogSettingButton[0].addEventListener('click', (e) => {

    dogSettingMenu.classList.toggle('show-menu');

    if(!dogSettingMenu.classList.contains('show-menu')) {
      dogSettingMenu.classList.toggle('hide-menu');
      setTimeout(() => {
        dogSettingMenu.classList.toggle('hide-menu');
      }, 400);

    }

    socket.emit('block-user', 'testdog@dog.com');

  });
}


socket.on('block-user', data => {
  console.log(data);
});

socket.on('message', message => {

  if (message.length === 0) {

    console.log('Empty input');

  } else {

    addNewMessage(message);
    document.querySelector('.is-typing').remove();
    socket.emit('message', message);

  }

});

// Listen for keypress to show the typing message.
if (chatInput) {

  chatInput.addEventListener('keypress', () => {

    socket.emit('typing');

  });

}

// When user is typing, show the other user that he is typing.
socket.on('typing', data => {

  const isTyping = document.createElement('p');
  const typingMessage = document.createTextNode(`${data.username} is typing...`);
  isTyping.classList += ' is-typing';
  isTyping.appendChild(typingMessage);

  if(!document.querySelector('.is-typing')) {

    chatContainer.appendChild(isTyping);

  }

});


if(chatContainer) {

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

}

if (chatButtons.length !== 0) {

  let currentlyActive = chatButtons[0];

  // Set chat index to 0
  socket.emit('chat-index', 0);

  currentlyActive.classList.add('active-chat');

  chatButtons.forEach(button => {


    button.addEventListener('click', () => {

      // Remove the active class
      currentlyActive.classList.remove('active-chat');

      // Add active class to clicked element
      button.classList.add('active-chat');

      // Set clicked element to current active element.
      currentlyActive = button;

      socket.emit('chat-index', getIndexOfChat(button));

      socket.emit('match-room', {email: 'bobby@gmail.com'});

    });

  });

}

function getIndexOfChat(button) {

  const chats = Array.prototype.slice.call(chatButtons);

  return chats.indexOf(button);

}


//Create HTML element of a chatbubble.
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

function logDogIn(dog) {

  // Get the "login" buttons.
  // When First button is clicked => next dog in template
  // When second button is clicked => Log dog into this.dog

  console.log(dog);

}

logDogIn();