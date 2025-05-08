import axios from "axios"

const AlmacenarDatos = async (values) => {
  const apiURL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${apiURL}/CREATE/almacenarRemision.php`, values)
    if (response.data.ok) {
      console.log(response.data.respuesta)
      return response.data.respuesta
    }
  } catch (error) {
    console.error("Error al enviar los datos", error)
  }
}

export default AlmacenarDatos