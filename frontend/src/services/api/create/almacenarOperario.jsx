import axios from "axios"

const AlmacenarOperario = async (values) => {
  const apiURL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${apiURL}/CREATE/almacenarOperarios.php`, values)
    if (!response.data.ok) {
      throw new Error("Ha ocurrido un error al almacenar el operario, si el error persiste, contacta al administrador")
    }
    //console.log("Datos almacenados correctamente:", response.data)
    return response.data
  } catch (error) {
    console.error("Error al enviar los datos", error)
    throw error
  }
}

export default AlmacenarOperario