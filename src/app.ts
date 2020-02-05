import dotenv from "dotenv";
import {
    Client
} from "discord.js";
import {
    Ementa
} from "./com.brenosalles.ementa/Ementa";
import {
    parseEmenta,
    testEmenta
} from "./com.brenosalles.ementa/EmentaParser";
import {
    downloadFile,
    startConversionJob,
    checkConversionJob,
    getAllFiles,
    deleteFile,
    downloadEmentaPdf
} from "./com.brenosalles.ementa/EmentaDownloader";

const sleep = (n:number) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

dotenv.config({path: `${__dirname}/config.env`});

let ementas: Array < Ementa > = [];
const client: Client = new Client();

const test = async () => {
    let jobDetails = await startConversionJob(`${__dirname}/ESTGV.pdf`);
    do {
        jobDetails = await checkConversionJob(jobDetails["id"]);
        sleep(5);
    } while(jobDetails["status"] != "successful");

    for (const file of jobDetails["target_files"]) {
        console.log(file)
        await downloadFile(file["id"], `${__dirname}/${file["name"]}`);
    }
}

client.once("ready", async () => {
    const allFiles = await getAllFiles();
    console.log(allFiles)
    for (const file of allFiles["data"]) {
        console.log(await deleteFile(file["id"]));
    }

    console.log(await downloadEmentaPdf(`${__dirname}/ESTGV.pdf`));

    let jobDetails = await startConversionJob(`${__dirname}/ESTGV.pdf`);
    console.log(jobDetails);
    do {
        jobDetails = await checkConversionJob(jobDetails["id"]);
        console.log(jobDetails);
        sleep(5);
    } while(jobDetails["status"] != "successful");

    for (const file of jobDetails["target_files"]) {
        console.log(await downloadFile(file["id"], `${__dirname}/${file["name"]}`));
    }

   // testEmenta(`${__dirname}/ESTGV.csv`);
    console.log("ready!");
});

client.on("message", message => {
    if (message.author.bot) {
        return;
    }
    if (message.content.startsWith("!") === false) {
        return;
    }
    const args: Array < string > = message.content.slice("!".length).split(/ +/);
    const commandName: string = ( < string > args.shift()).toLowerCase();

    switch (commandName) {
        case "help":
            message.reply("the possible commands are:\n`!today` - sends today's menu.\n`!tomorrow` - sends tomorrow's menu.\n`!day dd-mm` - get a specific day menu.");
            break;
        case "today":
            const today: Date = new Date();
            const todayEmentas: Array < Ementa > = ementas.filter(ementa => {
                if (ementa.getDate().getUTCDate() != today.getUTCDate()) {
                    return;
                }
                if (ementa.getDate().getUTCMonth() != today.getUTCMonth()) {
                    return;
                }
                return ementa;
            });
            for (const ementa of todayEmentas) {
                message.channel.send(ementa.toString());
            }
            break;
        case "tomorrow":
            const tomorrow: Date = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1);
            const tomorrowEmentas: Array < Ementa > = ementas.filter(ementa => {
                if (ementa.getDate().getUTCDate() != tomorrow.getUTCDate()) {
                    return;
                }
                if (ementa.getDate().getUTCMonth() != tomorrow.getUTCMonth()) {
                    return;
                }
                return ementa;
            });
            for (const ementa of tomorrowEmentas) {
                message.channel.send(ementa.toString());
            }
            break;
        case "day":
            if (args.length == 0) {
                message.reply("wrong command. Please type `!help` to understand it.");
                break;
            }
            const day: string = args[0].split("-")[0];
            const month: string = args[0].split("-")[1];
            const date: Date = new Date(new Date().getUTCFullYear(), +month - 1, +day);
            const specificEmentas: Array < Ementa > = ementas.filter(ementa => {
                if (ementa.getDate().getUTCDate() != date.getUTCDate()) {
                    return;
                }
                if (ementa.getDate().getUTCMonth() != date.getUTCMonth()) {
                    return;
                }
                return ementa;
            });
            for (const ementa of specificEmentas) {
                message.channel.send(ementa.toString());
            }
            break;
    }
});

client.login(process.env.DISCORD_TOKEN);