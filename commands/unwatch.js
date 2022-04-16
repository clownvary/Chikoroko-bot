const { SlashCommandBuilder } = require("@discordjs/builders");
const { getDb } = require("../util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwatch")
    .setDescription("Cancel watching site changes"),
  async execute(interaction) {
    const db = getDb();
    const enableWatch = db.getData('/enableWatch');

    if (enableWatch) {
      db.push('/enableWatch', false);
      await interaction.reply("watcher removed...");
    } else {
      await interaction.reply("no watcher to remove...");
    }
  },
};
