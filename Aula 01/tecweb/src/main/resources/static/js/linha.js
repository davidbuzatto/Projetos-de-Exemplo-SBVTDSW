import { Forma } from "./Forma.js";

export class Linha extends Forma {
    
    constructor( xIni, yIni, xFim, yFim, corContorno, corPreenchimento ) {
        super( xIni, yIni, xFim, yFim, corContorno, corPreenchimento );
    }
    
    desenhar( ctx ) {
        
        ctx.save();
        
        ctx.lineWidth = this.larguraContorno;
        
        ctx.beginPath();
        ctx.moveTo( this.xIni, this.yIni );
        ctx.lineTo( this.xFim, this.yFim );
        
        ctx.strokeStyle = this.corContorno;
        ctx.stroke();
        
        ctx.restore();
        
    }
    
}