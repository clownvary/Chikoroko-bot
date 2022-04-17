/* eslint-disable consistent-return */
require('dotenv').config()
const fs = require("fs");
const axios = require("axios").default;
const cheerio = require("cheerio");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const { TARGET_URL, COMMANDS_DIR_PATH, CHANNEL_ID } = require("./config");

module.exports = {
  getNewDrop: async () => {
    const { data: html } = await axios.get(TARGET_URL);
    const $ = cheerio.load(html);
    const activeDrop = $(".swiper-slide").first();
    const dropPath = activeDrop.find("> a").attr("href");
    const title = activeDrop.find(".info-content .h2").text();
    return {
      link: `${TARGET_URL}${dropPath}`,
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
  }
};
