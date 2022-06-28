import { Guild } from "discord.js";
import { deactivateSettings } from "../Services/SettingsService";
import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildDelete",
  on: true,
  async execute(client: WuffelClient, guild: Guild) {
    await deactivateSettings(client.em, guild);
    console.log(
      consoleTimestamp() +
        " " +
        client.user!.username +
        " left the guild '" +
        guild.name +
        "'(" +
        guild.id +
        ")"
    );
  },
} as EventType;
