const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { CLIENT_ID, GUILD_ID, COMMANDS_DIR_PATH } = require("./config");
const { getCommandFiles,getToken } = require("./util");

const commands = [];
const TOKEN = getToken();
const rest = new REST({ version: "9" }).setToken(TOKEN);
const commandFiles = getCommandFiles();

for (const file of commandFiles) {
  const command = require(`${COMMANDS_DIR_PATH}/${file}`);
  commands.push(command.data.toJSON());
}
// regist commands
rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch((error) => console.error(error));
