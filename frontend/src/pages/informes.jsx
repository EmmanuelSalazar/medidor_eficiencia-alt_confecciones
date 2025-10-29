import { useState, useEffect } from "react";
import ListaRegistroOperacionesResumido from "../components/listas/listaRegistroOperacionesResumido";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { Segmented, Calendar, Spin } from "antd";
import { InfoCircleFilled, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import useRegistroOperacionesResumido from "../hooks/mostrarRegistroOperacionesResumido.hook";
/* import IncentivoQuincena from "../components/utils/incentivoQuincena"; */
import IncentivoQuincena from "../components/incentivoQuincena";
import FechaActual from "../components/fechaActual";
import logo from '../assets/img/svg/logo.svg'
import { useNavigate } from "react-router-dom";
function Informes() {
    const { obtenerCortes } = FechaActual();
    const { beneficio, porcentajeEstatico } = IncentivoQuincena();
    const navigate = useNavigate();
    const cortes = obtenerCortes();
    const [seccion, setSeccion] = useState(1);
    const [listaOperarios, setListaOperarios] = useState([]);
    const [listaAuditoria, setListaAuditoria] = useState([]);
    const [listaRevisiones, setListaRevisiones] = useState([]);
    const [listaEmpaque, setListaEmpaque] = useState([]);
    const [eficienciaOperarias, setEficienciaOperarias] = useState([]);
    const [eficienciaRevisiones, setEficienciaRevisiones] = useState([]);
    const [eficienciaEmpaque, setEficienciaEmpaque] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(cortes.fechaInicio);
    const [fechaFin, setFechaFin] = useState(cortes.fechaFinal);
    const { reload, data, status, error } = useRegistroOperacionesResumido(seccion,fechaInicio, fechaFin);
    useEffect(() => {
        if (status === 'success') {
            console.log(data);
            setListaOperarios(data.filter(item => item.RolOperario === 1));
            setListaRevisiones(data.filter(item => item.RolOperario === 2 || item.RolOperario === 4));
            setListaEmpaque(data.filter(item => item.RolOperario === 3));
        }
    }, [status, data]);
    useEffect(() => {
        setEficienciaOperarias(obtenerEficiencia(listaOperarios));
        setEficienciaRevisiones(obtenerEficiencia(listaRevisiones));
        setEficienciaEmpaque(obtenerEficiencia(listaEmpaque));
    }, [listaOperarios, listaEmpaque, listaRevisiones])

    const obtenerEficiencia = (datos) => {
        const totalModulo = datos.length;
        const eficienciaTotal = datos.reduce((a, b) => a + (parseInt(b.PromedioEficiencia) || 0), 0);
        const eficienciaPromedio = eficienciaTotal / totalModulo;
        return eficienciaPromedio.toFixed(1);
    }
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
    const secciones = [
        { label: 'M-1', value: '1', icon: <InfoCircleFilled /> },
        { label: 'M-2', value: '2', icon: <InfoCircleFilled />},
        { label: 'M-3', value: '3', icon: <InfoCircleFilled /> },
        { label: 'Otros', value: '4', icon: <InfoCircleFilled /> },
        { label: 'Auditoria', value: '5', icon: <InfoCircleFilled /> },
    ]

    return (
        <>
            <img className="imprimir watermark" src={logo} alt="Logo" style={{width: '100vw', height: '80vh'}} />
            <Container className="z-index-2">
            <Row className="my-3">
                    <Col className="noImprimir" lg={4}>
                        <Row className="mb-5">
                            <h1>Modulo {seccion}</h1>
                        </Row>
                        <Row className="my-3 mb-1">
                            <Col className="noImprimir">
                                <Segmented options={secciones} onChange={value => alCambio(value)} />
                            </Col>
                        </Row>
                        <Row className="pe-5">
                            <Calendar fullscreen={false} onChange={seleccionarFecha} />
                        </Row>
                        <Row>
                            <div className=" d-flex gap-2">
                                <Button  variant="secondary" onClick={() => reload()}><ReloadOutlined /> Actualizar datos</Button>
                                <Button onClick={() => window.print()}><PrinterOutlined /> Imprimir informe</Button>
                            </div>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="text-start">
                                <h1 className="imprimir">Modulo {seccion}</h1>
                                <h5>{fechaInicio} / {fechaFin}</h5>
                                <p className="text-secondary">Formato: AAAA-MM-DD</p>
                            </Col>
                            <Col className="d-flex flex-column text-center">
                                <div className="d-flex justify-content-end">
                                    <table className="table-bordered">
                                        <tbody>
                                            <tr>
                                                <td colSpan="3">
                                                    <h5>Promedio Eficiencia</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2">Operarios/as</td>
                                                <td className="p-2">Revision</td>
                                                <td className="p-2">Empaque</td>
                                            </tr>
                                            <tr>
                                                <td>{!isNaN(eficienciaOperarias) ? eficienciaOperarias + '%' : '--'}</td>
                                                <td>{!isNaN(eficienciaRevisiones) ? eficienciaRevisiones + '%' : '--'}</td>
                                                <td>{!isNaN(eficienciaEmpaque) ? eficienciaEmpaque + '%' : '--'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            {status === 'pending' ? <Spin className='mt-5' tip="Cargando..."><div></div></Spin> :
                                <>
                                { seccion != 5 ? <>
                                    <div>
                                        <h3>Operarios</h3>
                                        <ListaRegistroOperacionesResumido datos={listaOperarios} modulo={seccion} fechaInicio={fechaInicio} fechaFin={fechaFin} />
                                    </div>
                                    <div>
                                        <h3>Revisión</h3>
                                        <ListaRegistroOperacionesResumido datos={listaRevisiones} modulo={seccion} fechaInicio={fechaInicio} fechaFin={fechaFin} />
                                    </div>
                                    <div>
                                        <h3>Empaque</h3>
                                        <ListaRegistroOperacionesResumido datos={listaEmpaque} modulo={seccion} fechaInicio={fechaInicio} fechaFin={fechaFin} />
                                    </div>
                                </>  :    
                                    <Row className="mt-5">
                                        <h4>Auditoría</h4>
                                        <ListaRegistroOperacionesResumido datos={listaOperarios} modulo={seccion} fechaInicio={fechaInicio} fechaFin={fechaFin} />
                                        <span className="text-muted">La meta de auditoría se mide de esta forma: <strong>134</strong> (Unidades por hora) <strong>* 9.1</strong> (tiempo de trabajo) * <strong>(Dias trabajados en la quincena)</strong></span>
                                        <span className="text-muted">Las unidades producidas resultan de la suma de ambas auditorías</span>
                                    </Row>                              
                                }
                                 </>  
                            }
                        </Row>
                        {/* <Row className="justify-content-center">
                            <EstadisticaInforme modulo={seccion} fechaFin={fechaFin} fechaInicio={fechaInicio} />
                        </Row> */}
                    </Col>
                </Row>
            </Container>
        </>
        
    );
}
export default Informes;