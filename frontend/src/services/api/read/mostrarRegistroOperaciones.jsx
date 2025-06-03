import axios from 'axios';
import FechaActual from "../../../components/fechaActual";
const FetchRegistrosOperaciones = async (modulo, fecha_inicio, fecha_final) => {
    const apiURL = import.meta.env.VITE_API_URL;
    const { fechaActualDia } = FechaActual();
    let moduloSeleccionado = modulo?? null
    let fechaInicioSeleccionada = fecha_inicio?? fechaActualDia
    let fechaFinSeleccionada = fecha_final?? fechaActualDia

    try {
        const response = await axios.get(`${apiURL}/READ/mostrarRegistroOperaciones.php?fecha_inicio=${fechaInicioSeleccionada}&fecha_fin=${fechaFinSeleccionada}&modulo=${moduloSeleccionado}`)
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


/* import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import FechaActual from "../../../components/fechaActual";
export const useFetchData = () => {
    const { fechaActualDia } = FechaActual();
    const apiURL = import.meta.env.VITE_API_URL;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin, rol) => {
        let moduloSeleccionado = modulo ?? null
        let fechaInicioSeleccionada = fecha_inicio ?? fechaActualDia
        let fechaFinSeleccionada = fecha_final ?? fechaActualDia
        let horaInicioSeleccionada = hora_inicio ?? '00:00'
        let horaFinSeleccionada = hora_fin ?? '23:59'
        let rolSeleccionado = rol ?? 0;
            try {
                const response = await axios.get(`${apiURL}/READ/mostrarRegistroOperaciones.php?modulo=${moduloSeleccionado}&fecha_inicio=${fechaInicioSeleccionada}&fecha_fin=${fechaFinSeleccionada}&hora_inicio=${horaInicioSeleccionada}&hora_fin=${horaFinSeleccionada}&rol=${rolSeleccionado}`)
                if (response.data.ok) {
                    setData(response.data.respuesta)
                    return response.data.respuesta
                } else {
                    return []
                }
            }  catch (error) {
                setError(error instanceof Error ? error : new Error("Ha ocurrido un error desconocido"))
                console.error("Error al obtener datos:", error)
                throw error;
            } finally {
                setLoading(false)
            }
        },[]);
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        return {data, error, fetchData, loading}
} */
