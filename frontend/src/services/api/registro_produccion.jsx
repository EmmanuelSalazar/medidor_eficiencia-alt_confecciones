import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchData = useCallback(async (fecha, modulo, operarios) => {
      setLoading(true);
        try {
          const response = await axios.get(`${apiURL}/READ/calcularEficienciaDiaria.php?fecha=${fecha}&modulo=${modulo}&operarios=${operarios}`);
          // Validar estructura de respuesta
          if (response.data.ok) {
            console.log(response.data.respuesta);
            setData(response.data.respuesta);
            return response.data.respuesta;
          } else {
            setError(response.data);
            console.error("Respuesta inválida:", response.data);
            throw new Error("Respuesta inválida:", response.data);
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