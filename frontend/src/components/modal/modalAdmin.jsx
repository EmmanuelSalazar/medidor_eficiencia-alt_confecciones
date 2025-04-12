import React from "react";
import { Modal, Button, DatePicker, Space} from 'antd'
import { Row, Col , Button as ButtonBS} from 'react-bootstrap'
import ListaRegistroOperaciones from "../listas/listaRegistroOperaciones";
import {ListaContext } from "../../contexts/actualizarRegistroOperaciones";
import ExportToExcel from "../exportarExcel";
import BotonesSelModAdminRegOp from '../botonesSeleccion/botonesSeleccionModuloAdminModal'
import useFetchData from "../../services/api/read/mostrarRegistroOperacionesResumido";
const { RangePicker } = DatePicker;
const FechasDuales = () => {
    const { datos, error, fetchData, loading:useLoading } = useFetchData();
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
    // DESCARGAR RESUMEN
    const handleDownload = async () => {
        try {
            console.log(window.moduloSeleccionado, window.fechaInicio, window.fechaFin);
            await fetchData(window.moduloSeleccionado, window.fechaInicio, window.fechaFin);
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
        }
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
            await setListaRegistro(window.moduloSeleccionado, window.fechaInicio, window.fechaFin, window.horaInicio, window.horaFin);
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
            await setListaRegistro(window.moduloSeleccionado, dateStrings[0], dateStrings[1], window.horaInicio, window.horaFin)
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
            console.error("Ha ocurrido un error: ",error)
        }  
    }
    return (
        <>
            <Button type="primary" onClick={showModal}>Seleccionar rango de fechas</Button>
            <Modal title="Selecciona dos fechas" open={visible} onOk={handleOk} onCancel={handleCancel} width={{xl: '70%', xxl: '70%'}} footer={[
                <ExportToExcel datos={datos} texto="Descargar resumen" onClick={handleDownload}/>,
               <ButtonBS key="submit" type="primary" onClick={handleOk}>
                 Aceptar
               </ButtonBS>,
            ]}>
                    <Row className=" g-2">
                        <Col lg={5} md={12} sm={12}>
                            <strong className="mx-1">Seleccionar fecha</strong>
                            <RangePicker onChange={onPanelChange} />
                        </Col>
                        <Col lg={5} md={12} sm={12}>
                            <strong className="mx-1">Seleccionar hora</strong>
                            <RangePicker onChange={onChangeHours} picker="time" format="HH" disabledTime={disabledTime}/>
                        </Col>
                        <Col lg={2} md={12} sm={12}>
                            <ExportToExcel datos={listaRegistro}/> 
                        </Col>
                    </Row>
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