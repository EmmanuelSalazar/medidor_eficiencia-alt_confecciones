import React from "react";
import { Calendar, DatePicker } from 'antd'
import { ListaContext } from "../contexts/actualizarRegistros";
import { ListaContext as ContextoLista } from '../contexts/informacionGrafico'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate } from "react-router-dom";

dayjs.locale('es');
const CalendarioSeleccion = () => {
    const navigate = useNavigate();
    const { listaActualizada } = React.useContext(ListaContext);
    const { setFecha } = React.useContext(ContextoLista);
    
    const onPanelChange = async (value) => {
        const fecha = value.format('YYYY-MM-DD');
        const modulo = window.ModuloSeleccionado
        navigate(`?fecha=${fecha}`)
        try {
            await listaActualizada(fecha, modulo)
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