import data from '../utils/json/cortePorQuincena.json'
import cortes from '../utils/json/cortes.json'
const FechaActual = () => {
    var corteQuincena = "";
    var corteQuincenaFormateado = "";
    const formatearFecha = (num) => {
        return num < 10 ? `0${num}` : `${num}`;
    };
    
    const fecha = new Date();
    const opciones = {year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    const fechaMes = formatearFecha(fecha.getMonth() + 1);
    const fechaDia = formatearFecha(fecha.getDate());
    const fechaActualDia = fecha.getFullYear()+"-"+fechaMes+"-"+fechaDia;
    const tiempoUnix = Date.now();
    // MARCAR CORTE
        let fechaActual = fecha;
        let mesActual = fechaActual.getMonth()+1;
        let diaActual = fechaActual.getDate();
        let anioActual = fechaActual.getFullYear();
        const corte = data.find(corte => corte.mes == mesActual);
        const corteFormateado = cortes.find(corte => corte.mes == mesActual)
            if (diaActual <= 15) {
                corteQuincena = corte.primerCorte;
                corteQuincenaFormateado = corteFormateado.primerCorte;
            } else {
                corteQuincena = corte.segundoCorte;
                corteQuincenaFormateado = corteFormateado.segundoCorte;
            }

            function obtenerCortes(fecha) {
                let fechaProporcionada = fecha || fechaActualDia;
                let fechaSeparada = fechaProporcionada.split("-")
                let mesDeCorte = fechaSeparada[1];
                let diaDeCorte = fechaSeparada[2];
                var cortesFormateados = cortes.find(corte => corte.mes == mesDeCorte);
                if (diaDeCorte <= 15) {
                    const cortesSeparados = cortesFormateados.primerCorte;
                    let fechaInicio = `${anioActual}-${cortesSeparados[0].fechaInicial}`;
                    let fechaFinal = `${anioActual}-${cortesSeparados[0].fechaFinal}`;
                    return {fechaInicio, fechaFinal}
                } else {
                    const cortesSeparados = cortesFormateados.segundoCorte;
                    let fechaInicio = `${anioActual}-${cortesSeparados[0].fechaInicial}`;
                    let fechaFinal = `${anioActual}-${cortesSeparados[0].fechaFinal}`;
                    return {fechaInicio, fechaFinal}
                }
            }
            
    return {fechaFormateada, fechaActualDia, corteQuincena, tiempoUnix, corteQuincenaFormateado, anioActual, obtenerCortes}
    
}
export default FechaActual