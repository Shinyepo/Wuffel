import { GuildMember } from "discord.js";
import { addTraffic } from "../Services/TrafficService";
import { EventType, WuffelClient } from "types";

export = {
  name: "guildMemberAdd",
  on: true,
  async execute(client: WuffelClient, member: GuildMember) {
    console.log(member.user.id);

    await addTraffic(client.em, member, true);
    console.log("Added new traffic");
  },
} as EventType;
