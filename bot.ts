import { Client, Collection } from "discord.js";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-config"
import { WuffelClient, SlashCommandType } from "./types";
import { consoleTimestamp } from "./src/Utilities/timestamp";
import { loadCommands, loadEvents } from "./src/Utilities/PathLoader";

const main = async () => {
  console.log(consoleTimestamp() + " Initializing Shard...");
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);

  const client = new Client({
    partials: ["MESSAGE", "REACTION", "USER", "GUILD_MEMBER", "CHANNEL"],
    intents: [
      "DIRECT_MESSAGES",
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_VOICE_STATES",
      "GUILD_PRESENCES",
    ],
  }) as WuffelClient;

  client.em = orm.em;
  client.commands = new Collection();
  // Loading slash commands from ./SlashCommands
  await loadCommands(client, "SlashCommands");

  // Loading commands from ./Commands
  await loadCommands(client, "Commands");

  // Loading events from ./Events
  await loadEvents(client);

  // Slash command handler
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName) as SlashCommandType;

    if (!command) return;

    try {
      await command.execute(interaction);
      console.log(
        consoleTimestamp() +
          " #" +
          client.shard?.ids +
          " Executed " +
          interaction.commandName +
          "(Slash) by " +
          interaction.user +
          " in " +
          interaction.guild
      );
    } catch (err) {
      console.log(err);
    }
  });

  client.login(process.env.TOKEN);
};

main();
