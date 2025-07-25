import axios from 'axios';

// FUNCION PARA OBTENER DATOS
const FetchProduccion = async (pagina) => {
    const apiURL = import.meta.env.VITE_API_URL;
    const query = await axios.get(`${apiURL}/READ/mostrarProduccion.php?pagina=${pagina}`);
    if (query.data.ok) {
        return query.data.respuesta;
    } else {
        throw new Error(query.data.respuesta || 'Ha ocurrido un error al realizar la solicitud');
    }
};

export default FetchProduccion;
