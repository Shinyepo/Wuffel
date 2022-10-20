import { Guild, TextBasedChannel } from "discord.js";
import { EventSettings, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";

export const verifyEventSettings = async (
  client: WuffelClient,
  eventName: string,
  ...args: any[]
) => {
  let guild;
  if (args[0] instanceof Guild) {
    guild = args[0];
  } else {
    guild = args[0].guild as Guild;
  }
  if (!guild) return console.log("Could not find guild");

  let event;
  if (eventName.includes("guild")) event = EventSettings.guildEvents;
  else if (eventName.includes("emoji")) event = EventSettings.emojiEvents;
  else if (eventName.includes("voice"))
    event = EventSettings.voicePresenceEvents;
  else if (eventName.includes("channel")) event = EventSettings.channelEvents;
  else if (eventName.includes("message")) event = EventSettings.messageEvents;

  if (eventName.includes("guildMemberUpdate")) event = EventSettings.userEvents;

  if (!event) return;

  const settings = await getLogSettings(client.em, guild, event);

  if (!settings || !settings.on || !settings.channel) return null;
  const logChannel = guild.channels.cache.find(
    (x) => x.id === settings.channel
  ) as TextBasedChannel;
  if (!logChannel) return;

  return logChannel;
};
