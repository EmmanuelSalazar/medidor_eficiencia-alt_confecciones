import { useState } from 'react';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import RegistrarDespacho from '../components/formularios/registrarDespacho';
import InformeDespacho from '../components/informeDespacho';
import { PlantillaDespachoProvider } from '../contexts/plantillaDespacho';
import { ReloadOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { useNavigate } from 'react-router-dom';
import ListaRemision from '../components/listas/listaRemision';
import ListaBajas from '../components/listas/listaBajas';
import useMostrarRemision from '../hooks/mostrarRemisiones.hook';
import RotulosDespacho from '../components/rotulosDespacho';
import RegistrarBajas from '../components/formularios/registrarBajas';
function BodegaDespachos() {
    const [seccion, setSeccion] = useState(1);
    const [apartado, setApartado] = useState(1);
    const { reload } = useMostrarRemision();
    const navigate = useNavigate()
    const alCambio = (e) => {
        setSeccion(100);
        navigate('?plantilla=' + e)
        setTimeout(() => {
            setSeccion(e);
        }, 500)
                
    }
    const alCambioApartado = (e) => {
        setApartado(e);
        console.log(apartado);
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
        {
            value: 3,
            label: 'Lista de bajas'
        },
        {
            value: 4,
            label: 'Registrar bajas'
        }
    ];
    const apartados = [
        {
            value: 1,
            label: 'Remisión',
        },
        {
            value: 2,
            label: 'Rotulos',
        }
    ]
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
                    <Col className='noImprimir' lg={seccion === 1 || seccion === 3 ? 4 : 3}>
                        <h1 className='noImprimir'>{seccion <= 2 && 'Remision'}</h1>
                        <h1 className='noImprimir'>{seccion > 2 && 'Bajas'}</h1>
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
                        <Collapse in={seccion === 3} dimension='width'>
                            <div id="collapseExample">
                                <ListaBajas />
                            </div>
                        </Collapse>
                        <Collapse in={seccion === 4} dimension='width'>
                            <div id="collapseExample">
                                <RegistrarBajas/>
                            </div>
                        </Collapse>              
                    </Col>
                    <Col lg={1} className={`${seccion === 1 || seccion === 3 ? 'invisible' : ''}`}>
                    </Col>
                    <Col lg={6}>
                    <div className='noImprimir'>
                        <Row className='d-flex align-items-center flex-row noImprimir'>
                                <Col lg={3}>
                                    <h1 className='noImprimir text-muted'>Plantilla</h1>
                                </Col>
                                <Col lg={5}>
                                    <Segmented onChange={alCambioApartado} options={apartados}/>
                                </Col>
                        </Row>
                    </div>
                        <Row>
                        {apartado === 1 && <InformeDespacho/>}
                        {apartado === 2 && <RotulosDespacho/>}
                        </Row>
                    
                    </Col>
                </Row>
        </PlantillaDespachoProvider>
  );
}

export default BodegaDespachos;