import { Row, Col, Container } from 'react-bootstrap';
import RegistrarCliente from '../components/formularios/registrarCliente';
import ListaClientes from '../components/listas/listaClientes';
function BodegaClientes() {
    return (
        <Container>
            <Row className="my-2">
                <Col>
                    <h1>Clientes</h1>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <h4 className='text-secondary'>Registrar cliente</h4>
                    <RegistrarCliente />
                </Col>
                <Col>
                    <h4 className='text-secondary'>Lista de clientes</h4>
                    <ListaClientes />
                </Col>
            </Row>
        </Container>
    );
}
export default BodegaClientes;