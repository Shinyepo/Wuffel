import fs from "fs";
import path from "path";
import { applicationId, guildId } from "./config.json";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const commands = [];
console.time("Done in");
const joinedPath = path.join(__dirname, "SlashCommands");

console.log(`Fetching slash commands in ${joinedPath}`);
const commandFiles = fs
  .readdirSync(joinedPath)
  .filter((x) => x.endsWith(".js"));
const commandNames = [];

for (const file of commandFiles) {
  const command = require(`${joinedPath}/${file}`);
  commandNames.push(command.data.name);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

let readyString = "";

for (const name of commandNames) {
  readyString += name + "\n";
}
console.log("Found " + commandNames.length + " commands.\n" + readyString);
(async () => {
  try {
    console.log("Started deploying Slash Commands...");
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });
    console.log("Successfully deployed all commands.");
    console.timeEnd("Done in");
  } catch (error) {
    console.log(error);
  }
})();
