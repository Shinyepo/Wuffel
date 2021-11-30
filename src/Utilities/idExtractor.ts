import { Guild } from "discord.js";

export const ExtractId = async (
  guild: Guild,
  message: string,
  type: "channel" | "user"
) => {
  let extracted = "";
  if (message.includes("<")) {
    extracted = message.substring(2, 20);
  } else {
    extracted = message;
  }

  if (type === "channel") {
    const channel = guild.channels.cache.find((x) => x.id === extracted);
    return channel;
  } else if (type === "user") {
    const user = guild.members.cache.find((x) => x.id === extracted);
    return user;
  }
  return null;
};
