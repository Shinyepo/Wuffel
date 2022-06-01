import { Message } from "discord.js";
import { CommandType, WuffelClient } from "../../types";
import { getSettings } from "../Services/SettingsService";

export = {
  name: "messageCreate",
  on: true,

  async execute(client: WuffelClient, message: Message) {
    if (message.author.bot) return;
    const settings = await getSettings(client.em, message.guild!);

    const prefix = settings?.prefix ?? "+";
    const split = message.content.trim().split(/ +/g);
    
    if (message.content.indexOf(prefix) !== 0) {
      if (message.mentions.has(client.user!) && split.length === 1) {
        return await message.reply(
          "My prefix for this server is **" + prefix + "**"
        );
      }
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();

    const command = client.commands.find(
      (x) => x.data.name.toLowerCase() === commandName
    ) as CommandType;

    if (!command) return;

    return command.execute(client, message, ...args);
  },
};
