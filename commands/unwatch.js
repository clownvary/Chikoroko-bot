const { SlashCommandBuilder } = require("@discordjs/builders");
const { send,resetWatcherConfig } = require("../util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwatch")
    .setDescription("Cancel watching site changes"),
  async execute(client, interaction) {
    const { enableWatch } = client;
    if (enableWatch) {
      resetWatcherConfig(client);
      await send(client, interaction, "watcher removed...")
    } else {
      await send(client, interaction, "no watcher to remove...")
    }
  },
};
