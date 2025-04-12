import axios from "axios"

const AlmacenarUsuario = async (values) => {
  const apiURL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${apiURL}/CREATE/almacenarUsuario.php`, values)
    if (!response.data.ok) {
      throw new Error("Ha ocurrido un error al almacenar el usuario, si el error persiste, contacta al administrador")
    }
    return response.data
  } catch (error) {
    console.error("Error al enviar los datos", error)
    throw error
  }
}

export default AlmacenarUsuario