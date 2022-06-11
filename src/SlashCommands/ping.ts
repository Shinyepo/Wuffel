import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandType } from "../../types";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check API Latency."),
  async execute(_, interaction) {
    const latency = interaction.client.ws.ping;

    await interaction.reply("API Latency is " + latency + "ms 🏓");
  },
} as SlashCommandType;
