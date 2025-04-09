import React, {useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EstadisticaMensual from '../components/graficos/estadisticaMensual';
import { ListaProvider } from '../contexts/actualizarRegistroOperaciones';
import EstadisticaTrimestral from '../components/graficos/estadisticaTrimestral';
function Estadisticas() {
    return (
        <Container>
            <ListaProvider>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-center mt-2">
                        <h1>Rendimiento historico</h1>
                    </Col>
                </Row>
                <Row className="justify-content-between mt-5">
                    <Col lg={6} xs={12}>
                        <h3>Ultimos 30 días</h3>
                        <EstadisticaMensual />
                    </Col>
                    <Col lg={6} xs={12}>
                        <h3>Ultimos 90 días</h3>
                        <EstadisticaTrimestral />
                    </Col>
                </Row>
            </ListaProvider>
        </Container>
    );
}
export default Estadisticas;