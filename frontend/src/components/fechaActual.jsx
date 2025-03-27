const FechaActual = () => {
    const formatearFecha = (num) => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    const fecha = new Date();
    const opciones = {year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    const fechaMes = formatearFecha(fecha.getMonth() + 1);
    const fechaDia = formatearFecha(fecha.getDate());
    const fechaActualDia = fecha.getFullYear()+"-"+fechaMes+"-"+fechaDia;
    return {fechaFormateada, fechaActualDia}
    
}
export default FechaActual