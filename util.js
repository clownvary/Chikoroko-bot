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
    const url = `${TARGET_URL}/catalog/catalog_paginator/`
    try {
      const { data: html } = await axios.get(url, {
        headers: {
          cookie:
            "_fbp=fb.1.1656926684834.2010604535; _gid=GA1.2.2079486437.1656926685; csrftoken=Mnnn3uYaRa9Tn0eM5asrCEdtpAehEd7fqUXbGYeVLYDIzy9d56HsZu1IEQVZB8NM; _ga_L6QZHBLTQQ=GS1.1.1656926684.1.1.1656927511.58; _ga=GA1.1.1534674939.1656926685",
          "X-CSRFToken":
            "sEOjqP3D51cTg3coREmApyLt9CkVTyCB6bo73jjoZPGIsB7PRABBMozIoS1DQti8",
          "HX-Request": true,
          "HX-Target": "souvenir-list",
          "HX-Trigger": "souvenir-list",
          Host: "expo.chikoroko.art",
          Pragma: "no-cache",
          Referer: "https://expo.chikoroko.art/catalog/",
        },
      });
      const $ = cheerio.load(html);
        const activeDrop = $(".souvenir-item").first();
      title = activeDrop.find(".souvenir-item__wrapper .h2").text();
      dropPath = title && title.toLowerCase().split(' ').join('-');
    } catch (e) {
      console.error(e);
    }

    return {
      link: `${TARGET_URL}/catalog/${dropPath}` || '',
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
