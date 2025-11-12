import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarRegistroOperacion = () => {
    const apiURL = import.meta.env.VITE_API_MIDDLEWARE_SERVER;

    const [datos, setData] = useState([]);
    const [error, setError] = useState(null);
    const actualizarRegistroOperacion = useCallback(async (values) => {
      let informacion = values ?? {};
        try {
          const response = await axios.put(`${apiURL}/actualizarOperacion`, informacion);          // Validar estructura de respuesta
          if (response.data.ok) {
            setData(response.data.respuesta);
            return response.data.respuesta; // Array garantizado
          } else {
            throw new Error(response.data.respuesta || 'Ha ocurrido un error, intentalo denuevo mas tarde')
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
          throw error?.response?.data?.respuesta || error
        }
      }, [apiURL]);
        useEffect(() => {
            actualizarRegistroOperacion();
        }, [actualizarRegistroOperacion]);
        return {datos, error, actualizarRegistroOperacion}
}
export default ActualizarRegistroOperacion;