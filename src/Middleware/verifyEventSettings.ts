import { Guild, TextBasedChannel } from "discord.js";
import {
  channelEvents,
  emojiEvents,
  EventSettings,
  guildEvents,
  messageEvents,
  userEvents,
  voicePresenceEvents,
  WuffelClient,
} from "../../types";
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
  if (messageEvents.indexOf(eventName) > -1)
    event = EventSettings.messageEvents;
  if (guildEvents.indexOf(eventName) > -1) event = EventSettings.guildEvents;
  if (emojiEvents.indexOf(eventName) > -1) event = EventSettings.emojiEvents;
  if (channelEvents.indexOf(eventName) > -1)
    event = EventSettings.channelEvents;
  if (userEvents.indexOf(eventName) > -1) event = EventSettings.userEvents;
  if (voicePresenceEvents.indexOf(eventName) > -1)
    event = EventSettings.voicePresenceEvents;

    console.log({event, eventName});
    
  if (!event) return;

  const settings = await getLogSettings(client.em, guild, event);

  if (!settings || !settings.on || !settings.channel) return null;
  const logChannel = guild.channels.cache.find(
    (x) => x.id === settings.channel
  ) as TextBasedChannel;
  if (!logChannel) return;

  return logChannel;
};
