const { SlashCommandBuilder } = require("@discordjs/builders");
const { getNewDrop, getLastDrop, setLastDrop } = require("../util");
const { WATCH_TIMEOUT } = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Start watching site changes"),
  async execute(interaction) {
    let { watcher: { interval = null, count = 0 } = {} } = process;
    const watchDrop = async () => {
      const { user, channel, client } = interaction;
      const { title, link } = await getNewDrop();
      const lastDrop = getLastDrop();
      const hasNewDrop = lastDrop !== title;
      if (hasNewDrop) {
        channel.send(`${user} new drop come out \n ${title} \n ${link}`);
        setLastDrop(title);
      }
      client.user.setActivity(`| ${count++}`, { type: "WATCHING" });
    };
    if (interval) {
      await interaction.reply("still have a watcher running...");
    } else {
      interval = setInterval(watchDrop, WATCH_TIMEOUT);
      await interaction.reply("run new watcher...");
    }
  },
};
