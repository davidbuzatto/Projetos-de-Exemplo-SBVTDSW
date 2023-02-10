export class Forma {
    
    xIni;
    yIni;
    xFim;
    yFim;
    
    corContorno;
    corPreenchimento;
    
    larguraContorno = 3;
    
    constructor( xIni, yIni, xFim, yFim, corContorno, corPreenchimento ) {
        this.xIni = xIni;
        this.yIni = yIni;
        this.xFim = xFim;
        this.yFim = yFim;
        this.corContorno = corContorno;
        this.corPreenchimento = corPreenchimento;
    }
    
    desenhar( ctx ) {
    }
    
}