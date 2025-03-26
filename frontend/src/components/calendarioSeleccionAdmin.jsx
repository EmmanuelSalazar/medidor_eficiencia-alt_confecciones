import React from "react";
import { Calendar, DatePicker } from 'antd'
import { ListaContext } from "../contexts/actualizarRegistros";
import { ListaContext as ContextoLista } from '../contexts/informacionGrafico'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
const { RangePicker } = DatePicker;
const CalendarioSeleccion = () => {
    const { listaActualizada } = React.useContext(ListaContext);
    const { actualizarLista } = React.useContext(ContextoLista);
    
    const onPanelChange = async (value) => {
        const fecha = value.format('YYYY-MM-DD');
        const modulo = window.ModuloSeleccionado
        window.fechaSeleccionada = value.format('YYYY-MM-DD');
        try {
            await listaActualizada(fecha, modulo)
            await actualizarLista(fecha, modulo);

        } catch (error) {
            console.log("Ha ocurrido un error:", error);
        }

    }
    return (
       
            <Calendar fullscreen={false} onSelect={onPanelChange}/>
    )
}

export default CalendarioSeleccion