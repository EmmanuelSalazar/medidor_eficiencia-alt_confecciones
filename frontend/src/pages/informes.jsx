import React,{ useState } from "react";
import ListaRegistroOperacionesResumido from "../components/listas/listaRegistroOperacionesResumido";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Segmented, Calendar } from "antd";
import { InfoCircleFilled, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import useRegistroOperacionesResumido from "../hooks/mostrarRegistroOperacionesResumido.hook";
import IncentivoQuincena from "../components/incentivoQuincena";
import FechaActual from "../components/fechaActual";
import EstadisticaInforme from "../components/graficos/estadisticaInformes";
import logo from '../assets/img/logo.png'
import { useNavigate } from "react-router-dom";
function Informes() {
    const { beneficio, porcentajeEstatico } = IncentivoQuincena();
    const { obtenerCortes } = FechaActual();
    const navigate = useNavigate();
    const cortes = obtenerCortes();
    const [seccion, setSeccion] = useState(1);
    const [fechaInicio, setFechaInicio] = useState(cortes.fechaInicio);
    const [fechaFin, setFechaFin] = useState(cortes.fechaFinal);
    const { reload } = useRegistroOperacionesResumido(seccion,fechaInicio, fechaFin);
    const alCambio = (e) => {
        setSeccion(parseInt(e));
        navigate('?modulo=' + e);
    }
    const seleccionarFecha = async (fecha) => {
        const fechaFormateada = fecha.format('YYYY-MM-DD');
        const cortes = obtenerCortes(fechaFormateada);
        setFechaInicio(cortes.fechaInicio);
        navigate('?modulo=' + seccion + '&fecha=' + fechaFormateada);
        setFechaFin(cortes.fechaFinal);
        try {
            await reload();
        } catch (error) {
            console.log(error);
        }
    }
    const datosAMostrar = async (modulo) => {
        let moduloSeleccionado = parseInt(modulo);
        try {
            await reload(moduloSeleccionado, fechaInicio, fechaFin);
        } catch (error) {
            console.log(error);
        }
    }
    const secciones = [
        { label: 'Modulo 1', value: '1', icon: <InfoCircleFilled /> },
        { label: 'Modulo 2', value: '2', icon: <InfoCircleFilled />},
        { label: 'Modulo 3', value: '3', icon: <InfoCircleFilled /> },
    ]

    return (
        <Container>
            <Row className="my-3">
                <Col className="noImprimir" lg={4}>
                    <Row className="mb-5">
                        <h1>Modulo {seccion}</h1>
                    </Row>
                    <Row className="my-3 mb-1">
                        <Col className="noImprimir">
                            <Segmented  options={secciones} onChange={value => alCambio(value)} />
                        </Col>
                    </Row>
                    <Row className=" pe-5">
                        <Calendar fullscreen={false} onChange={seleccionarFecha} />
                    </Row>
                    <Row>
                        <div className=" d-flex gap-2">
                            <Button  variant="secondary" onClick={() => datosAMostrar(seccion)}><ReloadOutlined /> Actualizar datos</Button>
                            <Button onClick={() => window.print()}><PrinterOutlined /> Imprimir informe</Button>
                        </div>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="imprimir">Modulo {seccion}</h1>
                            <img className="imprimir" src={logo} alt="Logo" style={{width: '45px', height: '45px'}} />
                        </div>
                        <Col className="text-start">
                            <h5>{fechaInicio} / {fechaFin}</h5>
                            <p className="text-secondary">Formato: AAAA-MM-DD</p>
                        </Col>
                        <Col className="text-end">
                            <h5>Beneficio: </h5>
                            <span>{beneficio === 'PUEDES' ? 'N /' : beneficio} </span>
                            <span>{porcentajeEstatico === 'LOGRARLO' ? 'A' : porcentajeEstatico}</span>
                        </Col>
                    </Row>
                    <Row>
                        <ListaRegistroOperacionesResumido modulo={seccion} fechaInicio={fechaInicio} fechaFin={fechaFin} />
                    </Row>
                    {/* <Row className="justify-content-center">
                        <EstadisticaInforme modulo={seccion} fechaFin={fechaFin} fechaInicio={fechaInicio} />
                    </Row> */}
                </Col>
            </Row>
        </Container>
    );
}
export default Informes;