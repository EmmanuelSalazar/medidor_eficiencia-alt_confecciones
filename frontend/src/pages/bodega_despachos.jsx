import { useState } from 'react';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import RegistrarDespacho from '../components/formularios/registrarDespacho';
import InformeDespacho from '../components/informeDespacho';
import { PlantillaDespachoProvider } from '../contexts/plantillaDespacho';
import { ReloadOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import ListaRemision from '../components/listas/listaRemision';
import useMostrarRemision from '../hooks/mostrarRemisiones.hook';
function BodegaDespachos() {
    const [seccion, setSeccion] = useState(1);
    const { reload } = useMostrarRemision();
    const alCambio = (e) => {
        setSeccion(4);
        setTimeout(() => {
            setSeccion(e);
        }, 500)
                
    }
    const secciones = [
        {
            value: 1,
            label: 'Lista de remisiones',
        },
        {
            value: 2,
            label: 'Registrar remisiones',
        },
    ];
  return (
        <PlantillaDespachoProvider>
            <Row className='mt-2'> 
                <Col lg={2} className='d-flex align-items-center flex-column gap-3'>
                <div className='noImprimir'>
                    <div className='d-flex flex-column gap-3'>
                        <Segmented options={secciones} onChange={alCambio} vertical/>
                        <Button variant="secondary" onClick={() => reload()}><ReloadOutlined /> Actualizar datos</Button>
                    </div>
                </div>
                </Col>
                <Col className='noImprimir' lg={seccion === 1 ? 4 : 3}>
                    <h1 className='noImprimir'>Remisión</h1>
                    <Collapse in={seccion === 1} dimension='width'>
                        <div id="collapseExample">
                            <ListaRemision />
                        </div>
                    </Collapse>
                    <Collapse in={seccion === 2} dimension='width'>
                        <div id="collapseExample">
                            <RegistrarDespacho/>
                        </div>
                    </Collapse>                
                </Col>
                <Col lg={1} className={`${seccion === 1 ? 'invisible' : ''}`}>
                </Col>
                <Col lg={6}>
                <InformeDespacho/>
                </Col>
            </Row>
        </PlantillaDespachoProvider>
  );
}

export default BodegaDespachos;