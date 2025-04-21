import { useState } from "react";
import ListaRegistroOperacionesResumido from "../components/listas/listaRegistroOperacionesResumido";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Segmented } from "antd";
import { InfoCircleFilled, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import useRegistroOperacionesResumido from "../hooks/mostrarRegistroOperacionesResumido.hook";
import IncentivoQuincena from "../components/incentivoQuincena";
import FechaActual from "../components/fechaActual";
import EstadisticaInforme from "../components/graficos/estadisticaInformes";
function Informes() {
    const { beneficio, porcentajeEstatico } = IncentivoQuincena();
    const { obtenerCortes } = FechaActual();
    const cortes = obtenerCortes();
    const [seccion, setSeccion] = useState(1);
    const { reload } = useRegistroOperacionesResumido(seccion);
    const alCambio = (e) => {
        setSeccion(e);
    }
    const datosAMostrar = async (modulo) => {
        let moduloSeleccionado = parseInt(modulo);
        try {
            await reload(moduloSeleccionado);
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
                    <Row className="my-3 mb-5">
                        <Col className="noImprimir">
                            <Segmented  options={secciones} onChange={value => alCambio(value)} />
                        </Col>
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
                        <h1 className="imprimir">Modulo {seccion}</h1>
                        <Col className="text-start">
                            <h5>{cortes.fechaInicio} / {cortes.fechaFinal}</h5>
                            <p className="text-secondary">Formato: AAAA-MM-DD</p>
                        </Col>
                        <Col className="text-end">
                            <h5>Beneficio: </h5>
                            {beneficio === 'PUEDES' ? 'N/' : beneficio}
                            {porcentajeEstatico === 'LOGRARLO' ? 'A' : porcentajeEstatico}
                        </Col>
                    </Row>
                    <Row>
                        <ListaRegistroOperacionesResumido modulo={seccion} />
                    </Row>
                    <Row className="justify-content-center">
                        <EstadisticaInforme modulo={seccion} />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
export default Informes;