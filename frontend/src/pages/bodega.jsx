import { useEffect } from 'react';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import { ReloadOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import RegistrarProduccion from '../components/formularios/registrarProduccion';
import { ListaProvider } from '../contexts/actualizarReferencias';
import ListaProduccion from '../components/listas/listaProduccion';
import useMostrarProduccion from '../hooks/mostrarProduccion.hook';
import { useState } from 'react';
function Bodega() {
    const { reload } = useMostrarProduccion();
    const [visible, setVisible] = useState(true);
    const [size, setSize] = useState(8)
    useEffect(() => {
        if(visible) {
            setSize(8)
        } else {
            setTimeout(() => {
            setSize(visible ? 8 : 11);
        }, 250);
        }
        
    }, [visible]);
    return (
        <div className='mx-1'>
            {/* <Row className='my-2'>
                <Col className='text-center'>
                    <h1>Bodega</h1>
                </Col>
            </Row> */}
            <Row className='my-2'>
                <Col className='mb-3' lg={1}>
                    <Row>
                        <div className="d-flex flex-column gap-1">
                            <Button variant="secondary" onClick={() => reload()}><ReloadOutlined /> Actualizar datos</Button>
                            <Button variant='secondary' onClick={() => setVisible(!visible)}><div style={{transform: 'rotate(90deg)'}}><VerticalAlignMiddleOutlined /></div> Contraer formulario</Button>
                        </div>
                    </Row>
                </Col>
                <Collapse dimension='width' in={visible}>
                    <Col lg={3} >
                    <ListaProvider>
                        <RegistrarProduccion />
                    </ListaProvider>
                    </Col>
                </Collapse>
                <Col lg={size}>
                    <ListaProduccion />
                </Col>
            </Row>
        </div>
    )
}
export default Bodega;