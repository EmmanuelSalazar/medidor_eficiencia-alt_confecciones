import axios from 'axios';
import FechaActual from "../../../components/fechaActual";
const fetchRegistrosResumidos = async (modulo, fechaInicio, fechaFin) => {
    const { fechaActualDia } = FechaActual();
    const apiURL = import.meta.env.VITE_API_URL;
    let moduloSeleccionado = modulo 
    let fechaInicioSeleccionado = typeof fechaInicio != 'undefined' ? fechaInicio : fechaActualDia;
    let fetchaFinSeleccionado = typeof fechaFin != 'undefined' ? fechaFin : fechaActualDia;
    const query = await axios.get(`${apiURL}/READ/mostrarRegistroOperacionesResumido.php?fecha_inicio=${fechaInicioSeleccionado}&modulo=${moduloSeleccionado}&fecha_fin=${fetchaFinSeleccionado}`);
    if (query.data.ok) {
      return query.data.respuesta;
  } else {
      throw new Error(query.data.respuesta || 'Ha ocurrido un error al realizar la solicitud');
  }
}
export default fetchRegistrosResumidos;