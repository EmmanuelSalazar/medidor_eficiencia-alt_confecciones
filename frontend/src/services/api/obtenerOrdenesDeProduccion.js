import axios from 'axios';

// FUNCION PARA OBTENER DATOS
const FetchOrdenesDeProduccion = async () => {
    const apiURL = import.meta.env.VITE_API_PLANING_URL;
    try {
        const query = await axios.get(`${apiURL}/onProduction`);
        return query.data;
    } catch (error) {
        throw new Error(error || 'Ha ocurrido un error al realizar la solicitud');
    }
};

export default FetchOrdenesDeProduccion;