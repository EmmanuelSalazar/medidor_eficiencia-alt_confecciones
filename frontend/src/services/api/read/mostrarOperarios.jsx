import axios from 'axios';
const fetchOperarios = async (modulo, redux) => {
    const apiURL = import.meta.env.VITE_API_URL;
    let moduloFinal = modulo?? null;
    let reduxFinal = redux?? false;
    try {
        const response = await axios.get(`${apiURL}/READ/mostrarOperarios.php?modulo=${moduloFinal}&redux=${reduxFinal}`)
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
export default fetchOperarios;


/* import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (modulo, redux) => {
        setLoading(true)
        let moduloFinal = modulo ?? null;
        let reduxFinal = redux ?? false;
            try {
                const response = await axios.get(`${apiURL}/READ/mostrarOperarios.php?modulo=${moduloFinal}&redux=${reduxFinal}`)
                if (response.data.ok) {
                    setData(response.data.respuesta)
                    return response.data.respuesta 
                } else {
                    console.error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
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
export default useFetchData; */