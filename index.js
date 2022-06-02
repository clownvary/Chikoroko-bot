/* eslint-disable no-fallthrough */
const { Client, Collection, Intents } = require("discord.js");
const startWatch = require('./startWatch');
const {
  getCommandFiles,
  getToken,
  resetWatcherConfig,
} = require("./util");
const {  COMMANDS_DIR_PATH } = require("./config");
require('./keep-alive');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

// init watcher config
client.commands = new Collection();
resetWatcherConfig(client);

const TOKEN = getToken();
const commandFiles = getCommandFiles();

for (const file of commandFiles) {
  const command = require(`${COMMANDS_DIR_PATH}/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once("ready", async () => {
  await startWatch(client);
  console.log("Chikoroko is online!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client,interaction);
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


