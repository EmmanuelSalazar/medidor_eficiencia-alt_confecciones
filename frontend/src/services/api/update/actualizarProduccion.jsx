import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarProduccion = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const actualizarProduccion = useCallback(async (values) => {
      let informacion = values ?? {};
        try {
          setLoading(true);
          const response = await axios.put(`${apiURL}/UPDATE/actualizarProduccion.php`, informacion);
          // Validar estructura de respuesta
          console.log(response.data);
          if (response.data.ok) {
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
            actualizarProduccion();
        }, [actualizarProduccion]);
        return {datos, error, actualizarProduccion, loading}
}
export default ActualizarProduccion;