import { Forma } from "./Forma.js";

export class Retangulo extends Forma {
    
    constructor( xIni, yIni, xFim, yFim, corContorno, corPreenchimento ) {
        super( xIni, yIni, xFim, yFim, corContorno, corPreenchimento );
    }
    
    desenhar( ctx ) {
        
        ctx.save();
        
        const x = this.xIni < this.xFim ? this.xIni : this.xFim;
        const y = this.yIni < this.yFim ? this.yIni : this.yFim;
        const larg = Math.abs( this.xIni - this.xFim );
        const alt = Math.abs( this.yIni - this.yFim );
        
        ctx.lineWidth = this.larguraContorno;
        
        ctx.beginPath();
        ctx.rect( x, y, larg, alt );
        
        ctx.fillStyle = this.corPreenchimento;
        ctx.fill();
        
        ctx.strokeStyle = this.corContorno;
        ctx.stroke();
        
        ctx.restore();
        
    }
    
}