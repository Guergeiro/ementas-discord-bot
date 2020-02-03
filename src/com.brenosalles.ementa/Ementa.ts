import {
    EmentaType
} from "./EmentaTypeEnum";

class Ementa {
    // Attributes
    private date: Date;
    private type: EmentaType;

    private sopa: string;
    private carne: string;
    private peixe: string;
    private dieta: string;
    private vegetariano: string;

    // Constructor
    constructor(date: Date, type: EmentaType, sopa: string, carne: string, peixe: string, dieta: string, vegetariano: string) {
        this.date = date;
        this.type = type;

        this.sopa = sopa;
        this.carne = carne;
        this.peixe = peixe;
        this.dieta = dieta;
        this.vegetariano = vegetariano;
    }

    // Getters & Setters
    getDate(): Date {
        return this.date;
    }

    setDate(date: Date) {
        this.date = date;
    }

    getType(): EmentaType {
        return this.type;
    }

    setType(type: EmentaType) {
        this.type = type;
    }

    getSopa(): string {
        return this.sopa;
    }

    setSopa(sopa: string) {
        this.sopa = sopa;
    }

    getCarne(): string {
        return this.carne;
    }

    setCarne(carne: string) {
        this.carne = carne;
    }

    getPeixe(): string {
        return this.peixe;
    }

    setPeixe(peixe: string) {
        this.peixe = peixe;
    }

    getDieta(): string {
        return this.dieta;
    }

    setDieta(dieta: string) {
        this.dieta = dieta;
    }

    getVegetariano(): string {
        return this.vegetariano;
    }

    setVegetariano(vegetariano: string) {
        this.vegetariano = vegetariano;
    }

    // String to String
    toString(): string {
        let output: string = `**== ${this.type == EmentaType.LUNCH ? "Almoço" : "Jantar"} ${this.date.getUTCDate()}-${this.date.getUTCMonth() + 1}-${this.date.getUTCFullYear()} ==**`;
        output += `\n*Sopa:* ${this.sopa}`;
        output += `\n*Carne:* ${this.carne}`;
        output += `\n*Peixe:* ${this.peixe}`;
        output += `\n*Dieta:* ${this.dieta}`;
        output += `\n*Vegetariano:* ${this.vegetariano}`;
        return output;
    }
}

export {
    Ementa,
    EmentaType
};