const { Client, Message } = require('discord.js');

module.exports = {
    data: {
        name: 'eval',
        description: 'Eval command for eval',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     */
    async execute(client, message, args) {
        if (message.author.id !== '190561911492968448') return;
        const clean = text => {
            if (typeof (text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            }
            else {
                return text;
            }
        };
        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            message.channel.send(clean(evaled), { code:'xl' });
          }
           catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }

    },
};

