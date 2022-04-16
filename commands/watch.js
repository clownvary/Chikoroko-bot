const { SlashCommandBuilder } = require("@discordjs/builders");
const { getNewDrop, getDb } = require("../util");
const { WATCH_TIMEOUT } = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Start watching site changes"),
  async execute(interaction) {
    let interval = null;
    let count = 0;
    const db = getDb();
    const enableWatch = db.getData('/enableWatch');
    const watchDrop = async () => {
      db.reload();
      const lastDrop = db.getData('/lastDrop');
      const currentEnableWatch = db.getData('/enableWatch');
      const { user, channel, client } = interaction;
      if (currentEnableWatch) {
        const { title=' ', link } = await getNewDrop();
        const hasNewDrop = lastDrop !== title;
        if (hasNewDrop) {
          channel.send(`${user} new drop come out \n ${title} \n ${link}`);
          db.push('/lastDrop', title);
        }
        client.user.setActivity(`| ${count++}`, { type: "WATCHING" });
      } else {
        clearInterval(interval);
        interval = null;
        count = 0;
        client.user.setActivity('UNWATCHING');
      }
    };
    if (enableWatch) {
      await interaction.reply("still have a watcher running...");
    } else {
      db.push('/enableWatch', true);
      interval = setInterval(watchDrop, WATCH_TIMEOUT);
      await interaction.reply("run new watcher...");
    }
  },
};
