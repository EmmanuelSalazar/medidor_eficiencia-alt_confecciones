import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EstadisticaMensual from '../components/graficos/estadisticaMensual';

function Estadisticas() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={6} className="text-center mt-2">
                    <h1>Rendimiento historico</h1>
                </Col>
            </Row>
            <Row className="justify-content-between mt-5">
                <Col lg={6}>
                    <h3>Rendimiento mensual</h3>
                    <EstadisticaMensual />
                </Col>
                <Col lg={6}>
                    <h3>Rendimiento trimestral</h3>
                    <EstadisticaMensual />
                </Col>
            </Row>
            <Row className="justify-content-center mt-5">
                <Col lg={10}>
                    <h2>Modulo 2</h2>
                    <p>Contenido del modulo 2</p>
                </Col>
            </Row>
        </Container>
    );
}
export default Estadisticas;