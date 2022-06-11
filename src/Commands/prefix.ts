import { prefixChange } from "../Services/SettingsService";
import { CommandType } from "../../types";

export = {
  data: {
    name: "prefix",
    description: "You can change prefix with this command",
  },
  permissionLevel: "admin",
  async execute(client, message, arg) {
    await prefixChange(client.em, message, arg);
  },
} as CommandType;
