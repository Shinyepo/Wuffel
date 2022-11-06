import { Guild, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { activateSettings } from "../Services/SettingsService";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildCreate",
  on: true,
  async execute(client: WuffelClient, _: TextBasedChannel, guild: Guild) {
    await activateSettings(client.em.fork(), guild);
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
