const moment = require('moment');

module.exports = {
    consoleTimestamp() {
      return '[' + moment().format('DD/MM - hh:mm:ss') + ']';
    },
};