import { Guild } from "discord.js";
import { createSettings } from "../Services/SettingsService";
import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildCreate",
  on: true,
  async execute(client: WuffelClient, guild: Guild) {
    await createSettings(client.em, guild);
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
