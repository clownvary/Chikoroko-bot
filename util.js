/* eslint-disable consistent-return */
const fs = require("fs");
const axios = require("axios").default;
const cheerio = require("cheerio");
const { TARGET_URL, LAST_DROP_PATH, COMMANDS_DIR_PATH } = require("./config");

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
  getLastDrop: () => {
    try {
      const lastDrop = fs.readFileSync(LAST_DROP_PATH, "utf8");
      return lastDrop;
    } catch (err) {
      console.error(err);
    }
  },
  setLastDrop: (lastDrop) => {
    try {
      fs.writeFileSync(LAST_DROP_PATH, lastDrop);
    } catch (err) {
      console.error(err);
    }
  },
  getCommandFiles: () => {
    return fs
      .readdirSync(COMMANDS_DIR_PATH)
      .filter((file) => file.endsWith(".js"));
  },
};
