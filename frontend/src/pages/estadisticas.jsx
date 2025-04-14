import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Segmented } from 'antd';
import { ListaProvider } from '../contexts/actualizarRegistroOperaciones';
import EstadisticaMensualProdMeta from '../components/graficos/estadisticaMensualProdMeta';
import { InfoCircleFilled } from '@ant-design/icons';
function Estadisticas() {
    const [seccion, setSeccion] = useState(1);
    const alCambio = (e) => {
        setSeccion(e);
        graficaAMostrar(e);
    }
    const graficaAMostrar = (modulo) => {
        let moduloSeleccionado = parseInt(modulo);
            return <EstadisticaMensualProdMeta modulo={moduloSeleccionado} total={true}/>;
    }
    const secciones = [
        { label: 'Modulo 1', value: '1', icon: <InfoCircleFilled /> },
        { label: 'Modulo 2', value: '2', icon: <InfoCircleFilled />},
        { label: 'Modulo 3', value: '3', icon: <InfoCircleFilled /> },
    ]
    return (
        <Container>
            <ListaProvider>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-center mt-2">
                        <h1>Rendimiento historico</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-secondary text-center my-3">
                        <h3>Unidades producidas vs Meta unidades <br />(Ultimos 30 días)</h3>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                        <Col lg={5} className='d-flex justify-content-center mb-3'>
                            <Segmented  options={secciones} onChange={value => alCambio(value)} />
                        </Col>
                        <Col lg={8} className='mb-5 text-center'>
                            <h4 className='text-secondary'>Modulo {seccion}</h4>
                            {graficaAMostrar(seccion)}
                        </Col> 
                </Row>
            </ListaProvider>
        </Container>
    );
}
export default Estadisticas;