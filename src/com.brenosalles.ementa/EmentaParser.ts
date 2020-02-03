import fs from "fs";
import csv from "csv-parser";
import {
    Ementa,
    EmentaType
} from "./Ementa";

const parseMonthToNumber = (month: string): number => {
    switch (month.toLowerCase()) {
        case "janeiro":
            return 0;
        case "fevereiro":
            return 1;
        case "março":
            return 2;
        case "abril":
            return 3;
        case "maio":
            return 4;
        case "junho":
            return 5;
        case "julho":
            return 6;
        case "agosto":
            return 7;
        case "setembro":
            return 8;
        case "outubro":
            return 9;
        case "novembro":
            return 10;
        default:
            return 11;
    }
}

const parseCsvDate = (csvData: string): Date => {
    const fullDate: string = csvData.split("\n")[1];
    const day: string = fullDate.split("/")[0];
    const month: string = fullDate.split("/")[1];
    const date = new Date(new Date().getFullYear(), parseMonthToNumber(month), +day);
    return date;
}

const parseCsvFood = (csvData: string): {
    sopa: string,
    carne: string,
    peixe: string,
    dieta: string,
    vegetariano: string
} => {
    const splitted: Array < string > = csvData.split("\n");
    const final: Array < string > = splitted.map(entry => {
        const withoutPrefix: string = entry.substr(entry.indexOf(" ") + 1);
        const withoutDigits: string = withoutPrefix.replace(/[0-9]/g, "");
        const withoutCommas: string = withoutDigits.replace(/,/g, "");
        return withoutCommas
    });
    const sopa: string = final[0] || "Not Available";
    const carne: string = final[1] || "Not Available";
    const peixe: string = final[2] || "Not Available";
    const dieta: string = final[3] || "Not Available";
    const vegetariano: string = final[4] || "Not Available";
    return {
        sopa,
        carne,
        peixe,
        dieta,
        vegetariano
    };
}

const parseCsvMenu = (entry: Array < string > ): Ementa => {
    const ementa = new Ementa(
        parseCsvDate(entry[0]),
        EmentaType.LUNCH,
        parseCsvFood(entry[2] || entry[3]).sopa,
        parseCsvFood(entry[2] || entry[3]).carne,
        parseCsvFood(entry[2] || entry[3]).peixe,
        parseCsvFood(entry[2] || entry[3]).dieta,
        parseCsvFood(entry[2] || entry[3]).vegetariano
    );
    return ementa;
}

const parseEmenta = (url: string): Promise<Array<Ementa>> => {
    return new Promise<Array<Ementa>>((resolve, reject) => {
        const output: Array < Ementa > = [];
        const readStream = fs.createReadStream(`${url}`);

        readStream.pipe(csv()).on("data", (entry) => {
            if (entry[0].length == 0) {
                return;
            }
            if (entry[0].indexOf("Feira") == -1 && entry[0].indexOf("Sábado") == -1 && entry[0].indexOf("Domingo") == -1) {
                return;
            }
            const ementa: Ementa = parseCsvMenu(entry);
            const result = output.filter(entry => entry.getDate().getTime() == ementa.getDate().getTime());
            if (result.length == 1) {
                ementa.setType(EmentaType.DINNER);
            }
            output.push(ementa);
        });
        readStream.on("error", e => {
            reject(e);
        })
        return readStream.on("end", () => {
            resolve(output);
        });

    });
}

export {
    parseEmenta
}