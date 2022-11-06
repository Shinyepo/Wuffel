import fs from "fs";
import { CommandType, EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "./timestamp";
import path from "path";
import { verifyEventSettings } from "../Middleware/verifyEventSettings";
import { GuildMember } from "discord.js";
import { addTraffic } from "../Services/TrafficService";

const ignoreEvents = ["guildCreate", "guildDelete", "messageCreate"];

export const loadCommands = async (
  client: WuffelClient,
  folderPath: string,
  name?: string
): Promise<void> => {
  const start = Date.now();
  const joinedPath = path.join(__dirname, "..", folderPath);

  const commandFiles = fs
    .readdirSync(joinedPath)
    .filter((x) => x.endsWith(".js"));

  for (const file of commandFiles) {
    const fileName = file.split(".")[0];
    const command = (await import(joinedPath + "/" + fileName)) as CommandType;

    client.commands.set(command.data.name, command);
  }

  const end = Date.now();
  const sw = (end - start) / 1000;
  console.log(
    consoleTimestamp() +
      ` Finished loading ${name || folderPath} in ` +
      sw +
      "s"
  );
};

export const loadEvents = async (client: WuffelClient): Promise<void> => {
  const start = Date.now();
  const joinedPath = path.join(__dirname, "..", "Events");
  const eventFiles = fs
    .readdirSync(joinedPath)
    .filter((x) => x.endsWith(".js"));
  for (const file of eventFiles) {
    const fileName = file.split(".")[0];
    const event = (await import(`${joinedPath}/${fileName}`)) as EventType;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else if (event.on) {
      client.on(event.name, async (...args) => {
        if (event.name === "guildMemberAdd") {
          await addTraffic(client.em, args[0] as GuildMember, true);
          console.log("Added new traffic");
        }
        if (event.name === "guildMemberRemove") {
          await addTraffic(client.em, args[0] as GuildMember, false);
          console.log("Added new traffic");
        }
        if (ignoreEvents.indexOf(event.name) !== -1) {
          return event.execute(client, null, ...args);
        }
        const logChannel = await verifyEventSettings(
          client,
          event.name,
          ...args
        );

        if (!logChannel) return;

        return event.execute(client, logChannel, ...args);
      });
      // client.on(event.name, event.execute.bind(null, client));
    }
  }
  const end = Date.now();
  const sw = (end - start) / 1000;
  console.log(consoleTimestamp() + " Finished loading Events in " + sw + "s");
};
