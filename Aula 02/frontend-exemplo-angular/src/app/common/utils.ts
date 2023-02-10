export class Utils {

    /**
     * Compara dois objetos por id.
     */
    static compararPorId( o1: any, o2: any ): boolean {
        return o1 && o2 && o1.id === o2.id;
    }

}
