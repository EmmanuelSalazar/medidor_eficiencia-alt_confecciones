import axios from 'axios';
const FetchInformacionGrafico = async () => {
    const apiURL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${apiURL}/READ/mostrarInformacionGrafico.php`);
        if (response.data.ok) {
            return response.data.respuesta
        } else {
            console.error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
            throw new Error(response.data.respuesta || 'Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
        }
    } catch (error) {
        console.log(error);
    }
}
export default FetchInformacionGrafico;