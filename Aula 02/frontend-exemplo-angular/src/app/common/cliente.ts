import { Cidade } from "./cidade";

export class Cliente {

    constructor(
        public id: number,
        public nome: string,
        public cidade: Cidade,
    ) {}

}
