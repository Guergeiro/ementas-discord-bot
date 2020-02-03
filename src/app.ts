import dotenv from "dotenv";
import {
    Client
} from "discord.js";
import {
    Ementa
} from "./com.brenosalles.ementa/Ementa";
import {
    parseEmenta
} from "./com.brenosalles.ementa/EmentaParser";

dotenv.config({
    path: `${__dirname}/config.env`
});

const getEmentas = async (): Promise < Array < Ementa >> => {
    const temp: Array < Ementa > = await parseEmenta(`${__dirname}/ESTGV.csv`);
    return temp;
}

(async () => {
    const ementas: Array < Ementa > = await getEmentas();
    const client: Client = new Client();

    client.once("ready", () => {
        getEmentas();
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
})();