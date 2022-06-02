const { SlashCommandBuilder } = require("@discordjs/builders");
const startWatch = require("../startWatch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Start watching site changes"),
  async execute(client, interaction) {
        await startWatch(client, interaction);
  },
};
