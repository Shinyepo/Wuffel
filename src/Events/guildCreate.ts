import { Guild } from "discord.js";
import { getSettings } from "../Services/SettingsService";
import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildCreate",
  on: true,
  async execute(client: WuffelClient, guild: Guild) {
    await getSettings(client.em, guild);
    console.log(
      consoleTimestamp() +
        " " +
        client.user!.username +
        " joined new guild '" +
        guild.name +
        "'(" +
        guild.id +
        ")"
    );
  },
} as EventType;
