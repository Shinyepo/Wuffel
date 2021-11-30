import { EntityManager } from "@mikro-orm/knex";
import { Guild } from "discord.js";
import { LogObject } from "Wuffel/types";
import { LogSettings } from "../Entities/LogSettings";

export const getLogSettings = async (
  em: EntityManager,
  guild: Guild,
  event: string
) => {
  const context = em.fork();
  const data = await context.findOne(LogSettings, { guildId: guild.id });
  if (!data) return null;
  const logSettings = data.settings?.find((x) => x.name === event);

  return logSettings;
};

export const setLogChannel = async (
  em: EntityManager,
  guildId: string,
  event: string,
  channel: string
) => {
  const context = em.fork();
  const data = await context.findOne(LogSettings, { guildId });
  const newSettings = {
    id: "1",
    name: event,
    channel,
    on: true,
  } as LogObject;

  if (!data) {
    const newEntry = await context.create(LogSettings, {
      guildId,
      settings: [newSettings],
    });

    await context.persistAndFlush(newEntry);
    return true;
  }

  const settings = data?.settings?.find(
    (x) => x.name.toLowerCase() === event.toLowerCase()
  );

  if (!settings) {
    const id = data.settings?.length! + 1;
    newSettings.id = id.toString();
    console.log(newSettings.id);
    
    data?.settings?.push(newSettings);
    await context.flush();
    return true;
  }
  settings.channel = channel;
  settings.on = true;
  await context.flush();
  return true;
};

export const toggleLog = async (
  em: EntityManager,
  guildId: string,
  event: string,
  state?: boolean
) => {
  const context = em.fork();
  const data = await context.findOne(LogSettings, { guildId });
  if (!data) return null;

  const settings = data.settings?.find(
    (x) => x.name.toLowerCase() === event.toLowerCase()
  );

  if (!settings) return null;
  if (!state) {
    settings.on = !settings.on;
  } else {
    settings.on = state;
  }
  await context.flush();
  return settings.on;
};
