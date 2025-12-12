import axios from 'axios';

//FUNCION PARA OBTENER LA SUMATORIA DE REFS
const mostrarSumatoriaReferencia = async (fecha_inicio, fecha_fin) => {
    const apiURL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${apiURL}/READ/mostrarSumatoriaReferencia.php?fecha_inicio=${fecha_inicio}&fecha_final=${fecha_fin}`);
        if(!response.data.ok){
            throw new Error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
        }
        return response.data.respuesta;
    } catch (error) {
        console.error('Error al obtener la sumatoria de referencias:', error);
        throw error;
    }
};
 export default mostrarSumatoriaReferencia;