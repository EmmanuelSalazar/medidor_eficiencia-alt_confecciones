import axios from "axios"

const AlmacenarDatos = async (values) => {
  const apiURL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${apiURL}/CREATE/almacenarRegistroOperaciones.php`, values)
    if (response.data.ok) {
      return response.data
    } else {
      throw new Error("Ha ocurrido un error al almacenar el registro, si el error persiste, contacta al administrador: ", response.data)
    }
   //console.log("Datos almacenados correctamente:", response.data)
    
  } catch (error) {
    console.error("Error al enviar los datos", error)
    throw error
  }
}

export default AlmacenarDatos