import { Row, Col, Container } from 'react-bootstrap';
import RegistrarDespacho from '../components/formularios/registrarDespacho';
import InformeDespacho from '../components/informeDespacho';
import { PlantillaDespachoProvider } from '../contexts/plantillaDespacho';
function BodegaDespachos() {
  return (
    <Container>
        <PlantillaDespachoProvider>
            <Row>  
                <Col lg={3}>
                <h1 className='noImprimir'>Remisión</h1>
                    <RegistrarDespacho/>
                </Col>
                <Col>
                    <InformeDespacho/>
                </Col>
            </Row>
        </PlantillaDespachoProvider>
    </Container>
  );
}

export default BodegaDespachos;