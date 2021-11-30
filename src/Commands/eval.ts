import { CommandType } from "../../types";

export = {
    data: {
        name: 'eval',
        description: 'Eval command for eval',
    },
    async execute(_, message, ...args) {
        if (message.author.id !== '190561911492968448') return;
        const clean = (text: string) => {
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
            // @ts-ignore: Unreachable code error
            message.channel.send(clean(evaled), { code: 'xl' });
          }
           catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }

    },
} as CommandType;

