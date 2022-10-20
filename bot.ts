import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-config";
import { WuffelClient, SlashCommandType } from "./types";
import { consoleTimestamp } from "./src/Utilities/timestamp";
import { loadCommands, loadEvents } from "./src/Utilities/PathLoader";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const main = async () => {
  console.log(consoleTimestamp() + " Initializing Shard...");
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);

  const client = new Client({
    partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.Reaction,
      Partials.ThreadMember,
      Partials.User,
      Partials.GuildScheduledEvent,
    ],
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
    ],
  }) as WuffelClient;

  client.em = orm.em;
  client.commands = new Collection();
  // Loading slash commands from ./SlashCommands
  await loadCommands(client, "SlashCommands");

  // Loading commands from ./Commands
  // await loadCommands(client, "Commands");

  // Loading events from ./Events
  await loadEvents(client);

  // Slash command handler
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(
      interaction.commandName
    ) as SlashCommandType;

    if (!command) return;

    try {
      await command.execute(client, interaction);
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
