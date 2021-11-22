import { SlashCommandBuilder} from "@discordjs/builders";
import { SlashCommandType } from "types";

export = {
    data: new SlashCommandBuilder()
        .setName('szuter')
        .setDescription('Pokaż klate!'),
    async execute(interaction) {
        try {
            const szuter = interaction.guild?.members.cache.get('228556663244718080');

            interaction.reply(szuter?.toString() + ' pokaż klate dla ' + interaction.user.toString());
        }
         catch (error) {
        console.log(error);
        }

    },
} as SlashCommandType;