import {useState, useCallback} from "react";
import axios from 'axios';
const EliminarUsuario = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (id) => {
        setLoading(true)
            try {
                const response = await axios.delete(`${apiURL}/DELETE/eliminarUsuario.php?id=${id}`)
                if (!response.data.ok) {
                    return console.error('Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
                }
                //console.log(response.data.respuesta);
                setData(response.data.respuesta)
                return response.data.respuesta
            }  catch (error) {
                setError(error instanceof Error ? error : new Error("Ha ocurrido un error desconocido"))
                console.error("Error al eliminar:", error)
                throw error;
                return [];
            } finally {
                setLoading(false)
            }
        },[]);

        return {data, error, fetchData}
}
export default EliminarUsuario;