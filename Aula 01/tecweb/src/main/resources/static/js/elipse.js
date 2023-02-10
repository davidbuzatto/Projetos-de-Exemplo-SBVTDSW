import { Forma } from "./Forma.js";

export class Elipse extends Forma {
    
    constructor( xIni, yIni, xFim, yFim, corContorno, corPreenchimento ) {
        super( xIni, yIni, xFim, yFim, corContorno, corPreenchimento );
    }
    
    desenhar( ctx ) {
        
        ctx.save();
        
        const x = this.xIni < this.xFim ? this.xIni : this.xFim;
        const y = this.yIni < this.yFim ? this.yIni : this.yFim;
        const raioH = Math.abs( this.xIni - this.xFim ) / 2;
        const raioV = Math.abs( this.yIni - this.yFim ) / 2;
        
        ctx.lineWidth = this.larguraContorno;
        
        ctx.beginPath();
        ctx.ellipse( x + raioH, y + raioV, raioH, raioV, 0, 0, Math.PI * 2 );
        
        ctx.fillStyle = this.corPreenchimento;
        ctx.fill();
        
        ctx.strokeStyle = this.corContorno;
        ctx.stroke();
        
        ctx.restore();
        
    }
    
}