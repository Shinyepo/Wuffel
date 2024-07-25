import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandType } from "../../types";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check API Latency."),
  async execute(client, interaction) {
    const latency = client.ws.ping;

    await interaction.reply({
      content: "API Latency is " + latency + "ms 🏓",
      ephemeral: true,
    });
  },
} as SlashCommandType;
