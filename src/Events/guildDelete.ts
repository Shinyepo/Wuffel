import { Guild, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildDelete",
  on: true,
  async execute(client: WuffelClient, _: TextBasedChannel, guild: Guild) {
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
