import {
    Ementa,
    EmentaType
} from "./Ementa";
import xlsx from "xlsx";

const parseMonthToNumber = (stringMonth: string): number => {
    switch (stringMonth.toLowerCase()) {
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

const parseDate = (stringDate: string): Date => {
    const fullDate: string = stringDate.split("\n")[1];
    const day: string = fullDate.split("/")[0];
    const month: string = fullDate.split("/")[1];
    const date = new Date(new Date().getFullYear(), parseMonthToNumber(month), +day);
    return date;
}

const parseFood = (csvData: string): {
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

const insertIntoMenu = (ementas: Array < Ementa > , value: Ementa) => {
    // Gets already inserted items with same date
    const temp = ementas.filter(ementa => ementa.getDate().getTime() == value.getDate().getTime());
    if (temp.length == 1) {
        value.setType(EmentaType.DINNER);
    }
    ementas.push(value);
}

const parseEmenta = (fileUrl: string) => {
    const ementas: Array < Ementa > = [];

    // Open Workbook
    const workbook = xlsx.readFile(`${fileUrl}`);

    // Loop over each page
    for (const pageName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[pageName];

        // Loop over each cell
        for (const dateCell in worksheet) {

            // Fetch value
            const dateCellValue = worksheet[dateCell]["v"] || worksheet[dateCell].v;

            // Ignore non string values
            if (typeof dateCellValue != "string") {
                continue;
            }

            // Ignore non date values
            if (dateCellValue.indexOf("Feira") == -1 && dateCellValue.indexOf("Sábado") == -1 && dateCellValue.indexOf("Domingo") == -1) {
                continue;
            }

            // Gets the position of the food
            const menuCellC = (dateCell.slice(0)).replace("A", "C");
            const menuCellD = (dateCell.slice(0)).replace("A", "D");

            const menuCell = worksheet[menuCellC] || worksheet[menuCellD];

            // Ignore non string cells
            if (typeof worksheet == "undefined") {
                continue;
            }

            // Get the value
            const menuCellValue = menuCell["v"] || menuCell.v;

            // Create the menu
            const ementa = new Ementa(
                parseDate(dateCellValue),
                EmentaType.LUNCH,
                parseFood(menuCellValue).sopa.trim(),
                parseFood(menuCellValue).carne.trim(),
                parseFood(menuCellValue).peixe.trim(),
                parseFood(menuCellValue).dieta.trim(),
                parseFood(menuCellValue).vegetariano.trim()
            );

            insertIntoMenu(ementas, ementa);
        }

    }
    return ementas;
}
export {
    parseEmenta
}