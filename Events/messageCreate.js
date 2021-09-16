module.exports = {
        name: 'messageCreate',
        on: true,
        async execute(client, message) {
                if (message.author.bot) return;

                if (message.content.indexOf(client.config.prefix) !== 0) return console.log('nie ma prefixu');

                const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
                const commandName = args.shift().toLowerCase();

                const command = client.commands.get(commandName);

                if (!command) return;

                command.execute(client, message);
        },
};