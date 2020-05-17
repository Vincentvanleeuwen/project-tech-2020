const moment = require('moment');

function formatMessage(dogName, text) {
  return {
    dogName,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;