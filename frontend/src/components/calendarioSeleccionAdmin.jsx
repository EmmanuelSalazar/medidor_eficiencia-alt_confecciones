import React from "react";
import { Calendar } from 'antd'
import { ListaContext } from "../contexts/actualizarRegistros";
import { ListaContext as ContextoLista } from '../contexts/informacionGrafico'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate } from "react-router-dom";

dayjs.locale('es');
const CalendarioSeleccion = () => {
    const navigate = useNavigate();
    const { setFecha:setFechaRegistros } = React.useContext(ListaContext);
    const { setFecha } = React.useContext(ContextoLista);
    
    const onPanelChange = async (value) => {
        const fecha = value.format('YYYY-MM-DD');
        navigate(`?fecha=${fecha}`)
        try {
            setFechaRegistros(fecha);
            setFecha(fecha);
        } catch (error) {
            console.log("Ha ocurrido un error:", error);
        }

    }
    return (
            <Calendar fullscreen={false} onSelect={onPanelChange}/>
    )
}

export default CalendarioSeleccion