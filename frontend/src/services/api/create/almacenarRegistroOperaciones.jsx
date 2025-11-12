import axios from "axios"

const AlmacenarDatos = async (values) => {
  const apiURL = import.meta.env.VITE_API_MIDDLEWARE_SERVER;
  try {
    const response = await axios.post(`${apiURL}/registrarOperacion`, values)
    if (response.data.ok) {
      return response.data
    } else {
      throw new Error(response.data.respuesta || 'Ha ocurrido un error, intentalo denuevo mas tarde')
    }    
  } catch (error) {
    console.error(error)
/*     console.error(error?.response?.data?.respuesta || error)
 */    throw error?.response?.data?.respuesta || error
  }
}

export default AlmacenarDatos