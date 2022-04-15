/* eslint-disable no-fallthrough */
const { Client, Collection, Intents } = require("discord.js");
const {
  getNewDrop,
  getLastDrop,
  setLastDrop,
  getCommandFiles,
} = require("./util");
const { WATCH_CHANNEL_ID, COMMANDS_DIR_PATH } = require("./config");
const token = process.env["token"];
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
let watchInterval = "";
let watchCount = 0;

client.commands = new Collection();
const commandFiles = getCommandFiles();

for (const file of commandFiles) {
  const command = require(`${COMMANDS_DIR_PATH}/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

const watchDrop = async () => {
  const { title, link } = await getNewDrop();
  const lastDrop = getLastDrop();
  const hasNewDrop = lastDrop !== title;
  if (hasNewDrop) {
    const watchChannel = client.channels.cache.get(WATCH_CHANNEL_ID);
    watchChannel.send(`@everyone new drop come out \n ${title} \n ${link}`);
    setLastDrop(title);
  }
  client.user.setActivity(`| ${watchCount++}`, { type: "WATCHING" });
};

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Chikoroko is online!");
});

// client.on("messageCreate", async (message) => {
//   const isValidUser = client.user !== message.author && !message.author.bot; // exclude bots messages
//   const cmd = message.content;
//   let channel = client.user;

//   if (isValidUser) {
//     switch (cmd) {
//       case WATCH_CMD:
//         if (watchInterval) {
//           await message.channel.send("still have a watcher running...");
//         } else {
//           await message.channel.send("run new watcher...");
//           watchInterval = setInterval(watchDrop, WATCH_TIMEOUT);
//         }

//         break;
//       case UN_WATCH_CMD:
//         if (watchInterval) {
//           clearInterval(watchInterval);
//           watchInterval = "";
//           watchCount = 0;
//           await message.channel.send("watcher removed...");
//         }
//         break;

//       default:
//         break;
//     }
//   }
// });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// // Login to Discord with your client's token
client.login(token);

// 24/7 run this process
// const http = require('http');
// http.createServer((req, res) => {
//   res.write("Hello, i am alive!");
//   res.end();
// }).listen(8080, () => {
//   console.log(`app listening at http://localhost:8080`);
// });
