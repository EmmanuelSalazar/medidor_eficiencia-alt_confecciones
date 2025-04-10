import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchData = useCallback(async (modulo, fechaInicio, fechaFin) => {
      setLoading(true);
        try {
          const response = await axios.get(`${apiURL}/READ/mostrarRegistroOperacionesResumido.php?fecha_inicio=${fechaInicio}&modulo=${modulo}&fecha_fin=${fechaFin}`);
          // Validar estructura de respuesta
          if (response.data.ok) {
            setData(response.data.respuesta);
            return response.data.respuesta;
          } else {
            setError(response.data.respuesta);
            console.error("Respuesta inválida:", response.data.respuesta);
          }
        } catch (error) {
          console.error("Error en fetchData:", error);
          throw error;
        } finally {
          setLoading(false);
        }
      }, [apiURL]);
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        return {datos, error, fetchData, loading}
}
export default useFetchData;