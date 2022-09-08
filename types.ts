import { SlashCommandBuilder } from "@discordjs/builders";
import { EntityManager } from "@mikro-orm/postgresql";
import { Client, Collection, CommandInteraction, Message } from "discord.js";

export type SlashCommandType = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  permissionLevel?: "all" | "guildMember" | "mod" | "admin" | "owner";
  execute: (client: WuffelClient, interaction: CommandInteraction) => void;
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
