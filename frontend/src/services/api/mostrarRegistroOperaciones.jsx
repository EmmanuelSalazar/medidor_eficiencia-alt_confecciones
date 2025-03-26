import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import FechaActual from "../../components/fechaActual";
const useFetchData = () => {
    const { fechaActualDia } = FechaActual();
    const apiURL = import.meta.env.VITE_API_URL;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin) => {
        let moduloSeleccionado = modulo ?? null
        let fechaInicioSeleccionada = fecha_inicio ?? fechaActualDia
        let fechaFinSeleccionada = fecha_final ?? fechaActualDia
        let horaInicioSeleccionada = hora_inicio ?? '00:00'
        let horaFinSeleccionada = hora_fin ?? '23:59'
        setLoading(true)
            try {
                const response = await axios.get(`${apiURL}/mostrarRegistroOperaciones.php?modulo=${moduloSeleccionado}&fecha_inicio=${fechaInicioSeleccionada}&fecha_fin=${fechaFinSeleccionada}&hora_inicio=${horaInicioSeleccionada}&hora_fin=${horaFinSeleccionada}`)
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
}
export default useFetchData;