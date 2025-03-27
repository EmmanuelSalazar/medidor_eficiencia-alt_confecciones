import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import FechaActual from "../../../components/fechaActual";
const useFetchData = () => {
    const { fechaActualDia } = FechaActual();
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (fechaConsultada, moduloConsultado, operariosConsultados) => {
        let fechaConsultadaFinal = fechaConsultada ?? fechaActualDia;
        setLoading(true)
            try {
                //console.log(`DEBUG ULTIMO NIVEL: ${apiURL}/READ/mostrarIngresosPorHoras.php?fecha=${fechaConsultadaFinal}&modulo=${moduloConsultado}&operarios=${operariosConsultados}`)
                const response = await axios.get(`${apiURL}/READ/mostrarIngresosPorHoras.php?fecha=${fechaConsultadaFinal}&modulo=${moduloConsultado}&operarios=${operariosConsultados}`)
                if (response.data.ok) {
                    console.log(response.data.respuesta);
                    setData(response.data.respuesta)
                    return response.data.respuesta
                } else{
                    console.error('Ha ocurrido un error: ', response.data)
                    return []
                }
            }  catch (error) {
                setError(error instanceof Error ? error : new Error("Ha ocurrido un error desconocido"))
                console.error("Error al obtener datos:", error)
                return [];
            } finally {
                setLoading(false)
            }
        },[]);
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        return {data, error, fetchData}
}
export default useFetchData;