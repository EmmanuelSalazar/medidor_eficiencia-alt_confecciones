import data from '../utils/json/cortePorQuincena.json'
const FechaActual = () => {
    var corteQuincena = "";
    const formatearFecha = (num) => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    const fecha = new Date();
    const opciones = {year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    const fechaMes = formatearFecha(fecha.getMonth() + 1);
    const fechaDia = formatearFecha(fecha.getDate());
    const fechaActualDia = fecha.getFullYear()+"-"+fechaMes+"-"+fechaDia;

    // MARCAR CORTE
        let fechaActual = fecha;
        let mesActual = fechaActual.getMonth()+1;
        let diaActual = fechaActual.getDate();
        const corte = data.find(corte => corte.mes == mesActual);
            if (diaActual <= 15) {
                corteQuincena = corte.primerCorte;
            } else {
                corteQuincena = corte.segundoCorte;
            }
    return {fechaFormateada, fechaActualDia, corteQuincena}
    
}
export default FechaActual