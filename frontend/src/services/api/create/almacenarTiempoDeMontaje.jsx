import axios from "axios"
const apiURL = import.meta.env.VITE_API_URL;
  const AlmacenarTiempoDeMontaje = async (datos) => {
    let datosAlmacenados = datos ?? {};
        try {
            const response = await axios.post(`${apiURL}/CREATE/almacenarTiempoDeMontaje.php`, datosAlmacenados)
            if (response.data.ok) {
            return response.data.respuesta
            } else {
                throw new Error(response.data.respuesta ?? "Ha ocurrido un error al realizar la solicitud");
            }
        } catch (error) {
            console.error("Error al enviar los datos", error)
            setRespuesta('Ha ocurrido un error: ', error);
            throw error;
        }
  }
export default AlmacenarTiempoDeMontaje