import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (modulo, redux) => {
        let moduloConsultado = modulo ?? null;
        let reduxConsultado = redux ?? 0;
        setLoading(true)
            try {
                const response = await axios.get(`${apiURL}/READ/mostrarReferencias.php?modulo=${moduloConsultado}&redux=${reduxConsultado}`);
                if (response.data.ok) {
                    setData(response.data.respuesta)
                    return response.data.respuesta
                } else {
                    setError(response.data.respuesta)
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