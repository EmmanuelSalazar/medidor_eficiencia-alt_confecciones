import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
        setSeccion(e);
    }
    const secciones = [
        {
            value: 1,
            label: 'Plantilla de remisión',
        },
        {
            value: 2,
            label: 'Lista de remisiones',
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
                <Col className='noImprimir' lg={3}>
                    <h1 className='noImprimir'>Remisión</h1>
                    <RegistrarDespacho/>
                </Col>
                <Col lg={6}>
                   {seccion === 1 ? <InformeDespacho/> : <ListaRemision />} 
                </Col>
                <Col lg={1}>
                </Col>
            </Row>
        </PlantillaDespachoProvider>
  );
}

export default BodegaDespachos;