import { Row, Col, Container, Stack } from 'react-bootstrap'
import TablaRegistros from '../components/listas/listaRegistro'
import { ListaProvider} from "../contexts/actualizarRegistros";
import { ListaProvider as ProveedorDeLista } from '../contexts/informacionGrafico'
import { ListaProvider as ProveedorDeLista2 } from '../contexts/actualizarRegistroOperaciones'
import { ListaProvider as ProveedorDeLista3 } from '../contexts/actualizarReferencias'
import BotonesSeleccionModulos from '../components/botonesSeleccion/botonesSeleccionModuloAdmin'
import CalendarioSeleccion from "../components/calendarioSeleccionAdmin";
import GraficaAdministrativa from "../components/graficos/graficoAdmin";
import FechasDuales from "../components/modal/modalAdmin";
import PorcentajeDeEficienciaDiaria from "../components/porcentajeEficienciaDelDia";
import PorcentajeDeEficienciaQuincenal from "../components/porcentajeEficienciaDeCorte";
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
                        <Row className="d-flex justify-content-around">
                            <Col lg={4} xs={5} md={6} className="bg-primary bg-opacity-50 rounded border border-primary my-2">
                                <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}} className="mb-2">
                                    <div className="p-2"><h4><strong>EFICIENCIA FINAL DEL DÍA</strong></h4></div>
                                    <PorcentajeDeEficienciaDiaria/>
                                </Stack>
                            </Col>
                            <Col lg={4} xs={5} md={6} className="bg-primary bg-opacity-50 rounded border border-primary my-2">
                                <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}} className="mb-2">
                                    <div className="p-2"><h4><strong>EFICIENCIA FINAL DE QUINCENA</strong></h4></div>
                                    <PorcentajeDeEficienciaQuincenal />     
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} xs={12} md={12} className="bg-primary bg-opacity-50 rounded border border-primary my-2">
                                <GraficaAdministrativa />
                            </Col>
                        </Row>
                    </ProveedorDeLista>
                </ListaProvider>
                
            </ProveedorDeLista3>
        </Container>
    )
}
export default TablaRegistro