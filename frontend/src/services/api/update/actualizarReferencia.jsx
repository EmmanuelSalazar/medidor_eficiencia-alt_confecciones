import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarReferencia = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const actualizarReferencia = useCallback(async (values) => {
      let informacion = values ?? {};
        try {
          const response = await axios.put(`${apiURL}/UPDATE/actualizarReferencia.php`, informacion);
          
          // Validar estructura de respuesta
          if (response.data.ok && Array.isArray(response.data.respuesta)) {
            setData(response.data.respuesta);
            return response.data.respuesta; // Array garantizado
          } else {
            console.error("Respuesta inválida:", response.data);
            return []; // Retornar array vacío
          }
          
        } catch (error) {
          console.error("Error en fetchData:", error);
          return []; // Retornar array vacío
        }
      }, [apiURL]);
        useEffect(() => {
            actualizarReferencia();
        }, [actualizarReferencia]);
        return {datos, error, actualizarReferencia}
}
export default ActualizarReferencia;