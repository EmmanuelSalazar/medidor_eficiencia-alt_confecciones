import { Container, Col, Row } from 'react-bootstrap'
import AgregarReferencia from '../components/formularios/agregarReferencia'
import { ListaProvider } from "../contexts/actualizarReferencias";
import ListaReferencias from "../components/listas/listaReferencias";
import BotonesSeleccionModulos from "../components/botonesSeleccion/botonesSeleccionModuloReferencias";
function Referencias() {
    return (
        <Container>
            <Row>
                <ListaProvider>
                    <Col lg="5">
                        <h1>Registrar Referencia</h1>
                        <AgregarReferencia/>
                    </Col>
                    <Col lg="7">
                        <Row className="my-3">
                            <BotonesSeleccionModulos/>
                        </Row>
                        <Row>
                            <ListaReferencias />
                        </Row>
                    </Col>
                </ListaProvider>
            </Row>
        </Container>
    )
}
export default Referencias
