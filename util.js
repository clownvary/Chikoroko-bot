/* eslint-disable consistent-return */
require('dotenv').config()
const fs = require("fs");
const axios = require("axios").default;
const cheerio = require("cheerio");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const { TARGET_URL, COMMANDS_DIR_PATH, CHANNEL_ID, GUILD_ID, VOICE_CHANNEL_ID, ALERT_PATH } = require("./config");

module.exports = {
  getNewDrop: async () => {
    let title = '';
    let dropPath = '';
    try {
      const { data: html } = await axios.get(TARGET_URL);
      const $ = cheerio.load(html);
      const activeDrop = $(".swiper-slide").first();
      dropPath = activeDrop.find("> a").attr("href");
      title = activeDrop.find(".info-content .h2").text();
    } catch (e) {
      console.error(e);
    }

    return {
      link: `${TARGET_URL}${dropPath}` || '',
      title,
    };
  },
  getCommandFiles: () => {
    return fs
      .readdirSync(COMMANDS_DIR_PATH)
      .filter((file) => file.endsWith(".js"));
  },
  getDb: () => {
    const db = new JsonDB(new Config("db", true, true, '/'));
    return db;
  },
  getToken: () => {
    return process.env['TOKEN'];
  },
  resetWatcherConfig: (client) => {
    client.enableWatch = false;
    client.interval = null;
    client.count = 0;
  },
  send: async (client, interaction, message) => {
    if (interaction) {
      await interaction.reply(message);
    }
    else {
      await client.channels.cache.get(CHANNEL_ID).send(message);
    }
  },
  getPlayer: () => {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const resource = createAudioResource(ALERT_PATH);
    player.play(resource);
    return player;
  },
  getVoiceConnection: (client) => {
    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.channels.cache.get(VOICE_CHANNEL_ID).guild.voiceAdapterCreator,
    });
    return connection;
  },
  playAlertSound: (client) => {
    const player = module.exports.getPlayer();
    const connection = module.exports.getVoiceConnection(client);
    const subscription = connection.subscribe(player);
    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
        // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        setTimeout(() => {
            subscription.unsubscribe();
        }, 10000);
    }
  }
};
