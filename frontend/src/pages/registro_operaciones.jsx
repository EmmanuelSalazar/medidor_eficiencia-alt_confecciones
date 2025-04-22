import RegistrarOperaciones from '../components/formularios/registrarOperaciones'
import ListaRegistroOperaciones from "../components/listas/listaRegistroOperaciones";
import { ListaProvider } from "../contexts/actualizarOperarios";
import { ListaProvider as ProveedorLista } from "../contexts/actualizarRegistroOperaciones";
import { ListaProvider as ProveedorLista2 } from "../contexts/actualizarReferencias";
import { Col, Row, Container } from 'react-bootstrap';
import BotonesSelModRegOp from '../components/botonesSeleccion/botonesSeleccionRegistroOperaciones'
function RegistroOperaciones() {
    return (
        <Container className="py-3 align-items-space-around">
           <ListaProvider>
                <ProveedorLista>
                    <ProveedorLista2>
                        <Row className="mb-5">
                            <BotonesSelModRegOp />
                        </Row>
                        <Row>
                            <Col lg="5" className="formulario">
                                <RegistrarOperaciones />
                            </Col>
                            <Col lg="7">
                                <ListaRegistroOperaciones />
                            </Col>
                        </Row>
                    </ProveedorLista2>
                </ProveedorLista>
          </ListaProvider> 
       </Container>
    )
}
export default RegistroOperaciones