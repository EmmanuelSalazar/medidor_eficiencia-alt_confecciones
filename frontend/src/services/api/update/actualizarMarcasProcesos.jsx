import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarMarcasDeProcesos = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const actualizarRegistroOperacion = useCallback(async (values) => {
      let informacion = values ?? {};
        try {
          const response = await axios.put(`${apiURL}/UPDATE/actualizarMarcasProcesos.php`, informacion);          // Validar estructura de respuesta
          if (response.data.ok) {
            setData(response.data.respuesta);
            return response.data.respuesta; // Array garantizado
          } else {
            setError("Ha ocurrido un error: " + response.data.respuesta);
            return []; // Retornar array vacío
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
          throw error;
        }
      }, [apiURL]);
        useEffect(() => {
            actualizarRegistroOperacion();
        }, [actualizarRegistroOperacion]);
        return {datos, error, actualizarRegistroOperacion}
}
export default ActualizarMarcasDeProcesos;