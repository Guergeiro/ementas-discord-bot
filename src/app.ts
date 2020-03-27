if (process.env.NODE_ENV != "production") {
    const dotenv = require(`dotenv`);
    dotenv.config({
        path: `${__dirname}/config.env`
    });
}
import fetch from "node-fetch";
import { Client, Message } from "discord.js";
import { Ementa } from "./ementas/Ementa";

const sendEmentasToChannel = (ementas: Array<Ementa>, message: Message) => {
    if (ementas.length == 0) {
        message.channel.send(`No menus available!`);
        return;
    }
    for (const ementa of ementas) {
        message.channel.send(ementa.toString());
    }
};

const processMessage = (date: Date, message: Message) => {
    const filteredEmentas: Array<Ementa> = ementas.filter((ementa) => {
        if (ementa.getDate().getUTCDate() != date.getUTCDate()) {
            return;
        }
        if (ementa.getDate().getUTCMonth() != date.getUTCMonth()) {
            return;
        }
        return ementa;
    });
    sendEmentasToChannel(filteredEmentas, message);
};

const ementas: Array<Ementa> = [];
const client: Client = new Client();

client.once("ready", async () => {
    const response = await fetch(`${process.env.API_URL}`);

    (await response.json()).map((obj: any) => {
        const ementa: Ementa = new Ementa(new Date(obj["date"]), obj["type"], obj["sopa"], obj["carne"], obj["peixe"], obj["dieta"], obj["vegetariano"]);
        ementas.push(ementa);
    });
});

client.on("message", (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content.startsWith("!") === false) {
        return;
    }
    if (message.guild == null) {
        return;
    }
    const args: Array<string> = message.content.slice("!".length).split(/ +/);
    const commandName: string = (<string>args.shift()).toLowerCase();

    switch (commandName) {
        case "help":
            message.reply(
                "the possible commands are:\n`!today` - sends today's menu.\n`!tomorrow` - sends tomorrow's menu.\n`!day dd-mm` - get a specific day menu."
            );
            break;
        case "today":
            const today: Date = new Date();
            processMessage(today, message);
            break;
        case "tomorrow":
            const tomorrow: Date = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1);
            processMessage(tomorrow, message);
            break;
        case "day":
            if (args.length == 0) {
                message.reply("this command is incorrect. Please type `!help` to understand it.");
                break;
            }
            const day: string = args[0].split("-")[0];
            const month: string = args[0].split("-")[1];
            const date: Date = new Date(new Date().getUTCFullYear(), +month - 1, +day);
            processMessage(date, message);
            break;
        default:
            message.reply("this command is unavailable. Please type `!help` to see available commands.");
    }
});

client.login(process.env.DISCORD_TOKEN);
