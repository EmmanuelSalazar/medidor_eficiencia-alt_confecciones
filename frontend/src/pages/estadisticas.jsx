import { Container, Row, Col } from 'react-bootstrap';
import { Segmented } from 'antd';
import EstadisticaMensual from '../components/graficos/estadisticaMensual';
import { ListaProvider } from '../contexts/actualizarRegistroOperaciones';
import EstadisticaTrimestral from '../components/graficos/estadisticaTrimestral';
import EstadisticaMensualProdMeta from '../components/graficos/estadisticaMensualProdMeta';
function Estadisticas() {
    const alCambio = (e) => {
        console.log(e);
    }
    const secciones = [
        { label: 'Modulo 1', value: '1' },
        { label: 'Modulo 2', value: '2' },
        { label: 'Modulo 3', value: '3' },
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
                    <Col lg={6} className="text-center my-3">
                        <h2>Unidades producidas</h2>
                    </Col>
                </Row>
                <Row className="justify-content-between">
                    <Col lg={6} xs={12}>
                        <h4 className='text-secondary'>Produccion, ultimos 30 días</h4>
                        <EstadisticaMensual />
                    </Col>
                    <Col lg={6} xs={12}>
                        <h4 className='text-secondary'>Produccion, ultimos 90 días</h4>
                        <EstadisticaTrimestral />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-center my-5">
                        <h2>Unidades producidas vs Meta unidades (Ultimos 30 días)</h2>
                    </Col>
                </Row>
                <Segmented vertical options={secciones} onChange={value => alCambio(value)} />

                <Row className="justify-content-center">
                    <Col lg={6} xs={12}>
                        <h4 className='text-secondary'>Modulo 1</h4>
                        <EstadisticaMensualProdMeta modulo={1} total={true}/>
                    </Col>
                    <Col lg={6} xs={12}>
                        <h4 className='text-secondary'>Modulo 2</h4>
                        <EstadisticaMensualProdMeta modulo={2} total={true}/>
                    </Col>
                    <Col lg={6} xs={12}>
                        <h4 className='text-secondary'>Modulo 3</h4>
                        <EstadisticaMensualProdMeta modulo={3} total={true}/>
                    </Col>
                </Row>
            </ListaProvider>
        </Container>
    );
}
export default Estadisticas;