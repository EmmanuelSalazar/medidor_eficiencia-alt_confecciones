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
          setLoading(true);
          const response = await axios.put(`${apiURL}/UPDATE/actualizarReferencia.php`, informacion);
          // Validar estructura de respuesta
          if (response.data.ok && Array.isArray(response.data.respuesta)) {
            setData(response.data.respuesta);
            return response.data.respuesta; // Array garantizado
          } else {
            setError("Respuesta inválida:", response.data.respuesta || "No se proporcionó respuesta válida");
            console.error("Respuesta inválida:", response.data.respuesta || "No se proporcionó respuesta válida");
            return []; // Retornar array vacío
          }   
        } catch (error) {
          console.error("Error en fetchData:", error);
          return []; // Retornar array vacío
        } finally {
          setLoading(false); 
       }
      }, [apiURL]);
        useEffect(() => {
            actualizarReferencia();
        }, [actualizarReferencia]);
        return {datos, error, actualizarReferencia, loading}
}
export default ActualizarReferencia;