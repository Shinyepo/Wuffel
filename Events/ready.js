const { consoleTimestamp } = require('../Utilities/timestamp');

module.exports = {
    name: 'ready',
    once : true,
    execute(client) {
        console.log(consoleTimestamp() + ' Logged in as ' + client.user.tag);
    },
};