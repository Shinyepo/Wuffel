const moment = require('moment');

module.exports = {
    consoleTimestamp() {
      return '[' + moment().format('DD/MM/YYYY - hh:mm:ss') + ']';
    },
};