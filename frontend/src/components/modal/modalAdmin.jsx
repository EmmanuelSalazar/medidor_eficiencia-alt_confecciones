import React from "react";
import { Modal, Button, DatePicker, Spin} from 'antd'
import { Row, Col , Button as ButtonBS, Alert} from 'react-bootstrap'
import ListaRegistroOperaciones from "../listas/listaRegistroOperaciones";
import {ListaContext } from "../../contexts/actualizarRegistroOperaciones";
import ExportToExcel from "../exportarExcel";
import { ContextoModulo } from "../../contexts/botonesSeleccionModuloAdmin";
import BotonesSelModAdminRegOp from '../botonesSeleccion/botonesSeleccionModuloAdminModal'
import useRegistroOperacionesResumido from "../../hooks/mostrarRegistroOperacionesResumido.hook";
const { RangePicker } = DatePicker;
const FechasDuales = () => {
    const { moduloSeleccionado  } = React.useContext(ContextoModulo);
    const [params, setParams] = React.useState({
        modulo: moduloSeleccionado, // Cambiar a 1 si no se selecciona ningun modulo,
        fechaInicio: null,
        fechaFin: null,
    }) 
    const { data, status, error, reload } = useRegistroOperacionesResumido(
        params.modulo,
        params.fechaInicio,
        params.fechaFin
    );
    React.useEffect(() => {
        setParams({
            ...params,
            modulo: moduloSeleccionado,
        })
    }, [moduloSeleccionado]);
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
    // CARGAR DATOS DE LA API AL INICIO
        React.useEffect(()=> {
            try {
                reload();
            } catch (error) {
                setMensajeDeError("Ha ocurrido un error: ", error);
            }
        },[]);

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
            await reload();
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
        setParams({
            ...params,
            modulo: moduloSeleccionado,
            fechaInicio: dateStrings[0],
            fechaFin: dateStrings[1],
        });
        try {
            await setListaRegistro(window.moduloSeleccionado, dateStrings[0], dateStrings[1], window.horaInicio, window.horaFin)
            await reload(); // Actualizar la lista con los datos de la api
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
            console.error("Ha ocurrido un error: ",error)
        }  
    }
/*     let uno = 1
    if (uno === 1 ) return (
        <Alert variant="warning">Esta funcion se encuentra en mantenimiento, por lo que podrás notar algunos errores y/o fallos en la información visible</Alert>
    ) */
    return (
        <>
            <Button type="primary" onClick={showModal}>Seleccionar rango de fechas</Button>
            <Modal title="Selecciona dos fechas" open={visible} onOk={handleOk} onCancel={handleCancel} width={{xl: '70%', xxl: '70%'}} footer={[
                <ExportToExcel key={1} datos={data} texto="Descargar resumen" onClick={handleDownload}/>,
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