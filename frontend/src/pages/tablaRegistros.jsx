import React from "react";
import { Row, Col, Container } from 'react-bootstrap'
import TablaRegistros from '../components/listas/listaRegistro'
import { ListaProvider} from "../contexts/actualizarRegistros";
import { ListaProvider as ProveedorDeLista } from '../contexts/informacionGrafico'
import { ListaProvider as ProveedorDeLista2 } from '../contexts/actualizarRegistroOperaciones'
import { ListaProvider as ProveedorDeLista3 } from '../contexts/actualizarReferencias'
import BotonesSeleccionModulos from '../components/botonesSeleccion/botonesSeleccionModuloAdmin'
import CalendarioSeleccion from "../components/calendarioSeleccionAdmin";
import GraficaAdministrativa from "../components/graficos/graficoAdmin";
import FechasDuales from "../components/modal/modalAdmin";
import PanelAdministrativo from '../components/modal/seleccionarOperarioContador'
import TiempoDeMontaje from "../components/modal/ingresarTiempoDeMontaje";
function TablaRegistro() {
    return (
        <Container>
            <ProveedorDeLista3>
                <ListaProvider>
                    <ProveedorDeLista>
                        <Row className="my-2">
                            <BotonesSeleccionModulos />
                        </Row>
                        <Row className="d-flex justify-content-between">
                            <Col lg={3} xs={12} md={6} className="mb-3">
                                <CalendarioSeleccion />
                                <ProveedorDeLista2>
                                    <FechasDuales />
                                </ProveedorDeLista2>
                            </Col>
                            <Col lg={8} xs={12}>
                                <TablaRegistros />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} xs={12} md={6} className="bg-primary bg-opacity-50 rounded border border-primary my-2">
                                <GraficaAdministrativa />
                            </Col>
                        </Row>
                    </ProveedorDeLista>
                </ListaProvider>
                <Row className="mb-2 g-2">
                    <Col lg={3}>
                        <PanelAdministrativo />
                    </Col>
                    <Col>
                        <TiempoDeMontaje />
                    </Col>
                </Row>
            </ProveedorDeLista3>
        </Container>
    )
}
export default TablaRegistro