import axios from 'axios';
import FechaActual from "../../../components/fechaActual";
const FetchRegistrosOperaciones = async (modulo, fecha_inicio, fecha_final, pagina) => {
    const apiURL = import.meta.env.VITE_API_URL;
    const { fechaActualDia } = FechaActual();
    let moduloSeleccionado = modulo?? null
    let fechaInicioSeleccionada = fecha_inicio?? fechaActualDia
    let fechaFinSeleccionada = fecha_final?? fechaActualDia
    let paginaSeleccionada = pagina?? 1;
    try {
        const response = await axios.get(`${apiURL}/READ/mostrarRegistroOperaciones.php?fecha_inicio=${fechaInicioSeleccionada}&fecha_fin=${fechaFinSeleccionada}&modulo=${moduloSeleccionado}&page=${paginaSeleccionada}`)
        if (response.data.ok) {
            return response.data.respuesta
        } else {
            console.error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
            throw new Error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
        }
    } catch (error) {
        console.log(error);
    }
}
export default FetchRegistrosOperaciones;
