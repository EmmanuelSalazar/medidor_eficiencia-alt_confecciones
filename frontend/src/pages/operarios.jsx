import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import AgregarOperarios from '../components/formularios/agregarOperarios'
import { ListaProvider } from "../contexts/actualizarOperarios";
import ListaOperarios from '../components/listas/listaOperarios';
import BotonesSeleccionModulos from "../components/botonesSeleccion/botonesSeleccionModuloOperarios";
function Operarios() {
    return (
    <Container>
        <Row>
           <ListaProvider>
                <Col lg="5" className="formulario">
                    <h1>Agregar Operarios</h1>
                    <AgregarOperarios />
                </Col>
                <Col lg="7">
                    <Row className="my-3">
                        <BotonesSeleccionModulos />
                    </Row>
                    <Row>
                        <ListaOperarios />
                    </Row>
                </Col>
           </ListaProvider>
        </Row>
    </Container>
    )
}
export default Operarios