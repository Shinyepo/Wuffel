import { Guild } from "discord.js";
import { removeSettings } from "../Services/SettingsService";
import { WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildDelete",
  on: true,
  async execute(client: WuffelClient, guild: Guild) {
    await removeSettings(client.em, guild);
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
};
