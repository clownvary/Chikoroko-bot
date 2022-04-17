# Chikoroko-bot

A discord bot for watching [Chikoroko](https://expo.chikoroko.art/) new drop.

![demo](./assets/demo.gif)

## Prerequisites

- discord account, regist [here](https://discord.com)

- create a application bot, [here](https://discord.com/developers/applications) 

- get a bot token/guild_id/cliend_id from previos step, and add that bot in your server

- optional: ensure your network can access all we used site, or you need a vpn.
  
  I recommend you use [replit](https://replit.com/), and my bot is on it.

- optional: uptimerobot account, regist [here](https://uptimerobot.com/)

## Installation
 
 run command `npm i`

## Getting Started

1. Check `config.js`

    > In generally, you don't need to change anything, unless you know what it is.

2. Update your discord bot token in `.env`

3. Deploy commands, run cmmand `npm run deploy_command`

4. Run wathcer

  run cmd `npm run start`, will run a watcher

4. Using commands

  You can use commands to restart or cancel a watcher as below:

  Type `/watch` in your channel(include your bot), it will start watching Chikoroko new drop, and will push notification when new drop come out.

  Type `/unwatch` to cancel watching

5. optional: running 24/7

 if you want running bot 24/7, you need do all optional steps in this readme doc, more detail please refer [Host-a-Discord-Bot-online-247-for-FREE](https://www.showwcase.com/show/11710/Host-a-Discord-Bot-online-247-for-FREE!)