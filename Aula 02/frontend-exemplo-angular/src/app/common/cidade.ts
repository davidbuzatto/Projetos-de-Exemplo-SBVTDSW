import { Estado } from "./estado";

export class Cidade {

    constructor(
        public id: number,
        public nome: string,
        public estado: Estado
    ) {}

}
