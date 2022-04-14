/* eslint-disable no-fallthrough */
const express = require('express');
const { Client, Intents } = require('discord.js');

const { getNewDrop, getLastDrop, setLastDrop } = require('./util');
const { WATCH_CMD, UN_WATCH_CMD, WATCH_TIMEOUT } = require('./config');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// const token = process.env['token']; // this code is for replit platform 
const { token } = require('./key.json');

let watchInterval = '';

const watchDrop = (message) => async () => {
    const { title, link } = await getNewDrop();
    const lastDrop = getLastDrop();
    const hasNewDrop = lastDrop !== title;
    if (hasNewDrop) {
        setLastDrop(title);
        await message.channel.send(`${message.author} new drop come out \n ${title} \n ${link}`);
    }
};

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Chikoroko is online!');
});
client.on('messageCreate', async (message) => {
    const isValidUser = client.user !== message.author && !message.author.bot; // exclude bots messages
    const cmd = message.content;
    if (isValidUser) {
        switch (cmd) {
            case WATCH_CMD:
                if (watchInterval) {
                    await message.channel.send('still have a watcher running...');
                } else {
                    await message.channel.send('start new watcher...');
                    watchInterval = setInterval(watchDrop(message), WATCH_TIMEOUT);
                }

                break;
            case UN_WATCH_CMD:
                if (watchInterval) {
                    clearInterval(watchInterval);
                    watchInterval = '';
                    await message.channel.send('watcher removed...');
                }
                break;

            default:
                break;
        }
    }
});
// // Login to Discord with your client's token
client.login(token);

// Remove below annotations for 24/7 running, it will work with uptimerobot 
// const app = express();
// const port = 3000;
// app.get('/', (req, res) => {
//     res.send('Hello, i am alive!');
// });
// app.listen(port, () => {
//     console.log(`app listening at http://localhost:${port}`);
// });
