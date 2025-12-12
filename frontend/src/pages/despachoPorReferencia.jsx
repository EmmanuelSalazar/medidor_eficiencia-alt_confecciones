import  useMostrarSumReferencias  from '../hooks/mostrarSumatoriaReferencia.hook';
import { Row, Col, Button, Container} from 'react-bootstrap';
import ListaSumatoriaReferencia from '../components/listas/listaSumatoriaReferencia.jsx';
import {DatePicker} from 'antd';
import {useState, useEffect} from 'react';


const { RangePicker } = DatePicker;
function DespachoPorReferencia() {
    const [fechas, setFechas] = useState(['2023-01-01', '2023-01-31']);
    const { status, data, error, reload } = useMostrarSumReferencias(fechas[0], fechas[1]);

    useEffect(() => {
        reload()
    }, [fechas])

    const fechasSeleccionadas = (dates, dateStrings) => {
       setFechas(dateStrings)
    }
    if (status === 'loading') {
        return <div>Cargando...</div>;
    }
    if (status === 'error') {
        return <div>Error: {error.message}</div>;
    }
    return (
        <Container>
            <Row className='mt-3'>
                <Col className='noImprimir d-flex flex-column' lg={4}>
                    <h5>Seleccionar el rango de fecha a estudiar</h5>
                    <RangePicker  onChange={fechasSeleccionadas} className='mt-3'/>
                    <Button onClick={() => window.print()} className='mt-3'>Imprimir</Button>
                </Col>
                <Col >
                    <ListaSumatoriaReferencia data={data} />
                </Col>
            </Row>
            
        </Container>
    )
}
export default DespachoPorReferencia;