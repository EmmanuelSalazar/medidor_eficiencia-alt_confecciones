import { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import RegistrarDespacho from '../components/formularios/registrarDespacho';
import InformeDespacho from '../components/informeDespacho';
import { PlantillaDespachoProvider } from '../contexts/plantillaDespacho';
import { Segmented } from 'antd';
import ListaRemision from '../components/listas/listaRemision';
function BodegaDespachos() {
    const [seccion, setSeccion] = useState(1);
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
                    <Segmented options={secciones} onChange={alCambio} vertical/>
                </div>
                </Col>
                <Col lg={3}>
                    <h1 className='noImprimir'>Remisión</h1>
                    <RegistrarDespacho/>
                </Col>
                <Col>
                   {seccion === 1 ? <InformeDespacho/> : <ListaRemision />} 
                </Col>
                <Col lg={1}>
                </Col>
            </Row>
        </PlantillaDespachoProvider>
  );
}

export default BodegaDespachos;