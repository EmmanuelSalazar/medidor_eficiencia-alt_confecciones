import { Row, Col, Button } from 'react-bootstrap';
import { ReloadOutlined } from '@ant-design/icons';
import RegistrarProduccion from '../components/formularios/registrarProduccion';
import { ListaProvider } from '../contexts/actualizarReferencias';
import ListaProduccion from '../components/listas/listaProduccion';
import useMostrarProduccion from '../hooks/mostrarProduccion.hook';
function Bodega() {
    const { reload } = useMostrarProduccion();
    return (
        <div className='mx-1'>
            <Row className='my-2'>
                <Col className='text-center'>
                    <h1>Bodega</h1>
                </Col>
            </Row>
            <Row>
                <Col className='mb-3' lg={1}>
                    <Row>
                        <div className="d-flex">
                            <Button variant="secondary" onClick={() => reload()}><ReloadOutlined /> Actualizar datos</Button>
                        </div>
                    </Row>
                </Col>
                <Col lg={3}>
                    <ListaProvider>
                        <RegistrarProduccion />
                    </ListaProvider>
                </Col>
                <Col lg={8}>
                    <ListaProduccion />
                </Col>
            </Row>
        </div>
    )
}
export default Bodega;