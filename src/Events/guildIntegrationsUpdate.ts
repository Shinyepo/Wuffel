import { Guild, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildIntegrationsUpdate",
  on: true,
  async execute(client: WuffelClient, _: TextBasedChannel, __: Guild) {
    
    console.log(consoleTimestamp() + " Logged in as " + client.user!.tag);
  },
} as EventType;
