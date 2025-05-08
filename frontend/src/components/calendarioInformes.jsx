import { useState } from "react";
import useRegistroOperacionesResumido from "../hooks/mostrarRegistroOperacionesResumido.hook";
import { Calendar } from "antd";
const CalendarioInformes = () => {
    const { reload } = useRegistroOperacionesResumido();
    
    return (
        <Calendar fullscreen={false} />
    )
}
export default CalendarioInformes;