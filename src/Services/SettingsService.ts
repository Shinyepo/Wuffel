import { EntityManager } from "@mikro-orm/knex";
import { Guild, Message } from "discord.js";
import { WuffelClient } from "Wuffel/types";
import { Settings } from "../Entities/Settings";

export const createSettings = async (em: EntityManager, guild: Guild) => {
  const newEntry = await em.create(Settings, {
    guildId: guild.id,
    prefix: "+",
    userCount: guild.memberCount.toString(),
    active: true
  });
  await em.persistAndFlush(newEntry);
  return newEntry;
};

export const getSettings = async (em: EntityManager, guild: Guild) => {
  var settings = await em.findOne(Settings, { guildId: guild.id });
  if (!settings) settings = await createSettings(em.fork(), guild);
  return settings;
};

export const deactivateSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });
  if (!settings) return;
  settings.active = false;
  await em.persistAndFlush(settings);
  return;
};

export const activateSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });
  if (!settings) return await createSettings(em.fork(), guild);
  settings.active = true;
  await em.persistAndFlush(settings);
  return;
};

export const prefixChange = async (
  em: EntityManager,
  { channel, guild }: Message,
  prefix: string
) => {
  if (prefix.length < 0) {
    channel.send("***Insert help message here***");
    return;
  }
  if (prefix.length > 4) {
    channel.send(
      "The prefix you provided is too long. Maximum length of prefix is 4 characters long."
    );
    return;
  }

  try {
    const context = em.fork();
    const settings = await context.findOne(Settings, { guildId: guild?.id });
    if (!settings) {
      channel.send("Something went wrong while changing prefix.");
      return;
    }
    settings.prefix = prefix;
    await context.flush();
    channel.send(`My prefix for this server has been changed to **${prefix}**`);
    return;
  } catch (error) {
    console.log(error);
  }
};

export const changeSetting = async (
  client: WuffelClient,
  guild: Guild,
  key: string,
  value: string
) => {
  const settings = await getSettings(client.em, guild);
  if (!settings) return;

  settings[key] = value;
  await client.em.flush();
  return true;
};
