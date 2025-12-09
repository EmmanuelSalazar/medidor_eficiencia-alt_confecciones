import axios from 'axios';

// FUNCION PARA OBTENER DATOS
const fetchSumatoriaPorDias = async (dia_inicio, dia_fin, operario) => {
    const apiURL = import.meta.env.VITE_API_URL;
    try { 
            const query = await axios.get(`${apiURL}/READ/mostrarSumatoriaPorDias.php?fecha_inicio=${dia_inicio}&fecha_fin=${dia_fin}&operario=${operario}`);
             console.log(query);
    if (query.data.ok) {
        return query.data.respuesta;
    } else {
        throw new Error(query.data.respuesta || 'Ha ocurrido un error al realizar la solicitud');
    }
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Ha ocurrido un error al realizar la solicitud');
    }
    
};

export default fetchSumatoriaPorDias;