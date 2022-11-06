import { SlashCommandBuilder } from "@discordjs/builders";
import { EntityManager } from "@mikro-orm/postgresql";
import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  Message,
} from "discord.js";

export type SlashCommandType = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  permissionLevel?: "all" | "guildMember" | "mod" | "admin" | "owner";
  execute: (
    client: WuffelClient,
    interaction: ChatInputCommandInteraction
  ) => void;
};
export type CommandType = {
  data: {
    name: string;
    description: string;
  };
  permissionLevel: "all" | "guildMember" | "mod" | "admin" | "owner";
  execute: (client: WuffelClient, message: Message, ...args: string[]) => void;
};

export type EventType = {
  name: string;
  on?: boolean;
  once?: boolean;
  execute: (...args: any[]) => void;
};

export type WuffelClient = {
  em: EntityManager;
  commands: Collection<string, CommandType | SlashCommandType>;
} & Client;

export class IgnoredLogObject {
  users?: String[];
  channels?: String[];
}

export class LogObject {
  id: string;
  name: String;
  on?: Boolean;
  channel?: String;
  ignored?: IgnoredLogObject;
}

export enum EventSettings {
  messageEvents = "messageEvents",
  channelEvents = "channelEvents",
  userEvents = "userEvents",
  voicePresenceEvents = "voicePresenceEvents",
  guildEvents = "guildEvents",
  emojiEvents = "emojiEvents",
}

export const messageEvents = [
  "messageDelete",
  "messageUpdate",
  "messageDeleteBulk",
];
export const guildEvents = [
  "invireCreate",
  "inviteDelete",
  "roleCreate",
  "roleDelete",
  "roleUpdate",
];
export const channelEvents = [
  "channelCreate",
  "channelDelete",
  "channelUpdate",
];
export const voicePresenceEvents = ["voiceStateUpdate"];
export const emojiEvents = [
  "emojiCreate",
  "emojiDelete",
  "emojiUpdate",
  "stickerCreate",
  "stickerDelete",
  "stickerUpdate",
];
export const userEvents = [
  "guildBanAdd",
  "guildBanRemove",
  "guildMemberUpdate",
  "guildMemberRemove",
  "guildMemberAdd",
];
