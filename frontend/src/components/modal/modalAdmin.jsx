import React from "react";
import { Modal, Button, DatePicker, Space} from 'antd'
import { Row } from 'react-bootstrap'
import ListaRegistroOperaciones from "../listas/listaRegistroOperaciones";
import {ListaContext } from "../../contexts/actualizarRegistroOperaciones";
import ExportToExcel from "../exportarExcel";
import BotonesSelModAdminRegOp from '../botonesSeleccion/botonesSeleccionModuloAdminModal'
const { RangePicker } = DatePicker;
const FechasDuales = () => {
    const { listaRegistro, setListaRegistro } = React.useContext(ListaContext)
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
        const [mensajeDeExito, setMensajeDeExito] = React.useState("");
        const [mensajeDeAlerta, setMensajeDeAlerta] = React.useState("");
        const [mensajeDeError, setMensajeDeError] = React.useState("");
        React.useEffect(() => {
                    if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
                        const timer = setTimeout(() => {
                            setMensajeDeExito("");
                            setMensajeDeAlerta("");
                            setMensajeDeError("");
                        }, 3000);
                    return () => clearTimeout(timer);
                    }
                }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);
    // FUNCION PARA DESHABILITAR HORAS EN LA SELECCION
    const disabledTime = (current) => {
        if (!current) return {};
        const hour = current.hour();
        return {
            disabledHours: () => [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23], // Horas deshabilitadas
        };
    };
    // FUNCION PARA MOSTRAR MODAL
    const showModal = () => { 
        setVisible(true)
    }
    // FUNCION PARA ACEPTAR EN MODAL
    const handleOk = () => {
        setVisible(false)
    }
    // FUNCION PARA CERRAR MODAL
    const handleCancel = () => { 
        setVisible(false)
    }
    // FUNCION DE SELECCION DE HORAS
    const onChangeHours = async (time, timeStrings) => {
        window.horaInicio = `${timeStrings[0]}:00`;
        window.horaFin = `${timeStrings[1]}:59`;
        console.log(horaInicio, horaFin)
        try {
            await setListaRegistro(window.moduloConsultado, window.fechaInicio, window.fechaFin, window.horaInicio, window.horaFin);
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
            console.log("Ha ocurrido un error: ", error)
        }
    }
    // FUNCION DE SELECCION DE FECHAS
    const onPanelChange = async (dates, dateStrings) => {
        window.fechaInicio = dateStrings[0];
        window.fechaFin = dateStrings[1];
        try {
            await setListaRegistro(window.moduloConsultado, dateStrings[0], dateStrings[1], window.horaInicio, window.horaFin)
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
            console.error("Ha ocurrido un error: ",error)
        }  
    }
    return (
        <>
            <Button type="primary" onClick={showModal}>Seleccionar rango de fechas</Button>
            <Modal title="Selecciona dos fechas" open={visible} onOk={handleOk} onCancel={handleCancel} width={{xl: '70%', xxl: '70%'}}>
                    <Space className="my-2">
                        <strong>Seleccionar fecha</strong>
                        <RangePicker onChange={onPanelChange}/>
                        <strong>Seleccionar hora</strong>
                        <RangePicker onChange={onChangeHours} picker="time" format="HH" disabledTime={disabledTime}/>
                        <ExportToExcel datos={listaRegistro}/> 
                    </Space>
                    <Row className="my-2">
                        <BotonesSelModAdminRegOp />
                    </Row>
                    {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                    {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                    {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
                    <ListaRegistroOperaciones />
            </Modal>
        </>
    )
}
export default FechasDuales;