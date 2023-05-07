const fmtMoeda = new Intl.NumberFormat( 
    "pt-BR", {
        style: "currency",
        currency: "BRL"
    }
);

const fmtNumero = new Intl.NumberFormat( 
    "pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
);
    
export { fmtMoeda, fmtNumero };