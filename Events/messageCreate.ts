import { Message } from "discord.js";
import { Settings } from "../Entities/Settings";
import { CommandType, WuffelClient } from "types";

export = {
  name: "messageCreate",
  on: true,

  async execute(client: WuffelClient, message: Message) {
    if (message.author.bot) return;
    const settings = await client.em.findOne(Settings, {
      guildId: message.guildId,
    });
    const prefix = settings?.prefix ?? "+";

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();

    const command = client.commands.get(commandName!) as CommandType;

    if (!command) return;

    command.execute(client, message, ...args);
  },
};