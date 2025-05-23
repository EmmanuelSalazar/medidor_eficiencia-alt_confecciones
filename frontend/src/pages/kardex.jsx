import { Container, Row, Col } from 'react-bootstrap';
import KardexDespacho from '../components/kardexDespacho';
function Kardex() {
    return (
        <Container className='mt-2'>
            <Row>
                <h1>Kardex</h1>
            </Row>
            <Row>
                <Col>
                    <KardexDespacho />
                </Col>
            </Row>
        </Container>
    )
}
export default Kardex;