/* eslint-disable no-fallthrough */
const { Client, Collection, Intents } = require("discord.js");
const {
  getCommandFiles,
  getToken,
  getDb
} = require("./util");
const {  COMMANDS_DIR_PATH } = require("./config");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const TOKEN = getToken();
const commandFiles = getCommandFiles();

for (const file of commandFiles) {
  const command = require(`${COMMANDS_DIR_PATH}/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once("ready", () => {
  const db = getDb();
  db.push('/enableWatch', false);
  console.log("Chikoroko is online!");
});

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
client.login(TOKEN);

// 24/7 run this process
// const http = require('http');
// http.createServer((req, res) => {
//   res.write("Hello, i am alive!");
//   res.end();
// }).listen(8080, () => {
//   console.log(`app listening at http://localhost:8080`);
// });
