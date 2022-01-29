const { Client } = require("discord.js");
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });
const fs = require("fs");

const client = new Client();
const { BOT_TOKEN, YOUR_MESSAGE, SERVER_ID } = require("./config.json");

client.on("ready", () => {
    console.log(client.user.tag + "is online.\n");
    Main();
});

function Main() {
    console.log("\tWelcome To DM-BOT");
    readline.question(SERVER_ID, response => {
        userIdSaver(response).then(() => {
            console.log("Starting Message send");
            setTimeout(() => {
                sendMessage(null, YOUR_MESSAGE).catch((err) => {
                    console.log(err)
                    setTimeout(() => {
                        console.log("Rebooting :)");
                    }, 1000);
                    setTimeout(() => {
                        process.exit(1);
                    }, 2000);
                });
            }, 2000);
        });
    });
}

async function userIdSaver(guildID) {
    client.guilds.fetch(guildID).then((guild) => {
        const file_path = './userId.json';
        const MemberIDs = guild.members.cache.map((users) => users.id)
        console.log("[++]" + MemberIDs.length + " Users Selected")
        const Data = {
            IDs: MemberIDs
        }
        const content = JSON.stringify(Data, null, 2)
        fs.writeFileSync(file_path, content, (err) => {
            if (err) return console.log("F-W Error: " + err)
            console.log("W Success" + file_path)
        })
    }).catch((err) => {
        console.log("ID Error: " + err)
        setTimeout(() => {
            console.log("Resetting Again");
        }, 1500);
        setTimeout(() => {
            process.exit(1);
        }, 4000);
    })
}


function sendMessage(users, msg) {
    return new Promise((resolve, reject) => {
        const scraped = require("./userId.json");
        users = scraped.IDs;
        for (let i = 0; i <= users.length; i++) {
            client.users.fetch(users[i]).then((u) => {
                u.send(msg).then(() => console.log("User: " + u.tag + " Message Done..")).catch((err) => console.log("Error: User: " + u.tag + " Not worked or This is a Bot." + err));
            }).catch((err) => console.log("Users Errors: " + err));
        }
        resolve();
    })
}

client.login(BOT_TOKEN).catch((err) => { console.log("Token Not Found: " + err) });