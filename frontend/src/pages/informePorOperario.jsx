import { useState, useEffect } from 'react'
import useMostrarSumatoriaPorDias from '../hooks/useSumatoriaPorDia';
import useMostrarOperarios from '../hooks/mostrarOperarios.hook';
import ListaPorOperario from '../components/listas/listaSumatoriaPorDia';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { format } from 'date-fns'; 
function InformePorOperario() {
    const [datePicked, setDatePicked] = useState([]);
    const [operarioPicked, setOperarioPicked] = useState();
    const { data, status, error, reload } = useMostrarSumatoriaPorDias(datePicked[0], datePicked[1], operarioPicked);
    const { data: operarios, status: operariosStatus, error: operariosError, reload: operariosReload } = useMostrarOperarios();
    console.log(operarios);
    useEffect(() => {
        reload();
    }, [datePicked, operarioPicked])

    const datesPicked = (dates, dateStrings) => {
        setDatePicked(dateStrings);
    }
    if (status === 'loading' || operariosStatus === 'loading') {
        return <div>Cargando...</div>;
    }
    if (status === 'error' || operariosStatus === 'error') {
        return <div>Error: {error?.message || operariosError?.message}</div>;
    }
    return (
        <Container>
            <Row>
                <Col lg={4} className='mt-2 g-5 py-3 rounded noImprimir'>
                    <Row className='mb-3 gap-1'>
                        <h4>Filtrar por rango de fechas</h4>
                        <span className='text-muted'>Selecciona las fechas que deseas estudiar <br/>(desde-hasta)</span>
                        <RangePicker
                            onChange={datesPicked}
                        />
                    </Row>
                    <Row className='mb-3 gap-1'>
                        <h4>Filtrar por operario</h4>
                        <span className='text-muted'>Selecciona el operario que deseas estudiar</span>
                        <Form.Select
                            style={{ width: 200 }}
                            onChange={e => setOperarioPicked(e.target.value)}
                        >
                            <option>Seleccionar operario</option>
                            {operarios?.map(operario => (
                                <option key={operario.op_id} value={operario.op_id}>
                                    {operario.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Row>
                    <Row>
                        <Button variant='primary' onClick={() => window.print()}>Imprimir</Button>
                    </Row>
                </Col>
                <Col lg={8} md={12} sm={12} className="py-3">
                    <ListaPorOperario data={data} />
                </Col>
            </Row>
        </Container>
    );
}
export default InformePorOperario;
