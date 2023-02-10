import { Cliente } from "./cliente";
import { ItemVenda } from "./item-venda";

export class VendaDTO {

    constructor(
        public cliente: Cliente,
        public itensVenda: ItemVenda[]
    ) {}

}
