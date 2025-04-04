import axios from "axios";
import React from "react";
const IniciarSesion = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [cargando, setCargando] = React.useState(false)
    const [error, setError] = React.useState("");
    const [exito, setExito] = React.useState(false);
    async function iniciarSesion(values) {
        try {
            setCargando(true);
            const response = await axios.post(`${apiURL}/auth/login.php`, values);
            if (response.data.ok) {
                let token = response.data.respuesta;
                localStorage.setItem('token', token);
                setExito("Se ha iniciado sesión exitosamente ;)")
            } else {
                setError(response.data.respuesta || "Ha ocurrido un error");
                console.error(response.data.respuesta || "Ha ocurrido un error");
            }
        } catch (error) {
            setError(error || "Ha ocurrido un error");
            console.error(error);
            throw error;
        } finally {
            setCargando(false);
        } 
    }     
    return { cargando, exito, error, iniciarSesion }
}
export default IniciarSesion

