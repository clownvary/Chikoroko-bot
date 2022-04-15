const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwatch")
    .setDescription("Cancel watching site changes"),
  async execute(interaction) {
    let { watcher: { interval = "", count = 0 } = {} } = process;
    if (interval) {
      clearInterval(interval);
      interval = "";
      count = 0;
      await interaction.reply("watcher removed...");
    }
  },
};
