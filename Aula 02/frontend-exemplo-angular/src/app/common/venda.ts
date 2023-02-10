import { Cliente } from "./cliente";

export class Venda {

    constructor(
        public id: number,
        public data: Date,
        public cancelada: boolean,
        public cliente: Cliente
    ) {}

}
