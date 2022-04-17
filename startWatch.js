const { getDb, getNewDrop, send } = require('./util');
const { WATCH_TIMEOUT } = require("./config");

module.exports = async (client, interaction = null) => {
    let { interval, count, enableWatch } = client
    const db = getDb();
    const testDrop = async () => {
        db.reload();
        const lastDrop = db.getData('/lastDrop');
        const { enableWatch: currentEnableWatch } = client;

        if (currentEnableWatch) {
            const { title = ' ', link } = await getNewDrop();
            const hasNewDrop = lastDrop !== title;
            if (hasNewDrop) {
                await send(client, interaction, `@everyone new drop come out \n ${title} \n ${link}`);
                db.push('/lastDrop', title);
            }
            client.user.setActivity(`| ${count++}`, { type: "WATCHING" });
        } else {
            clearInterval(interval);
            count = 0;
            client.user.setActivity('UNWATCHING');
        }
    };
    if (enableWatch && interval) {
        await send(client, interaction, "still have a watcher running...");
    } else {
        client.enableWatch = true;
        client.interval = setInterval(testDrop, WATCH_TIMEOUT);
        await send(client, interaction, "run new watcher...");
    }
}