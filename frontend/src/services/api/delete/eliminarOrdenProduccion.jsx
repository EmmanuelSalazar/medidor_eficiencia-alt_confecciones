import {useState, useCallback} from "react";
import axios from 'axios';
const EliminarOrdenProduccion = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (id) => {
        setLoading(true)
            try {
                const response = await axios.delete(`${apiURL}/DELETE/eliminarOrdenProduccion.php?id=${id}`)
                if (response.data.ok) {
                    console.log("Orden de produccion eliminado correctamente");
                } else {
                    return console.error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
                }
                //console.log(response.data.respuesta);
                setData(response.data.respuesta)
                return response.data.respuesta
            }  catch (error) {
                setError(error instanceof Error ? error : new Error("Ha ocurrido un error desconocido"))
                console.error("Error al eliminar:", error)
                throw error;
            } finally {
                setLoading(false)
            }
        },[]);

        return {data, error, fetchData, loading}
}
export default EliminarOrdenProduccion;