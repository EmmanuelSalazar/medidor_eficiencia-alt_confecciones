import useMostrarProduccion from "../hooks/mostrarProduccion.hook"
import { Spin } from "antd";
import { Alert, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
const InformacionProduccion = ({ data  = [{}]}) => {
    const [buscarParametro] = useSearchParams();
    let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
    const modulo = moduloEnLaUrl ? moduloEnLaUrl : 1;
    // const { data, status, error } = useMostrarProduccion();
    if (!data) {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    }

    function infoProduccion() {
        // FILTRAR POR MODULO
       const datos = data?.filter((datos) => datos.modulo === modulo);
       var datosFiltrados
        // VERTIFICAR SI HAY O NO DATOS
       if (datos.length === 0) {
        datosFiltrados = [{ dias: 'N/A', produccionTotal: 'N/A', produccionHecha: 'N/A', referencia: 'N/A', produccionRestante: 'N/A', ordenDeProduccion: 'N/A' }]
        return datosFiltrados
       } else {
            datosFiltrados = datos.map((datos) => {
            let cantidad_restante =  datos.cantidadEntrada - datos.unidadesProducidas;
            return {
                DiasDeTrabajo: datos.dias_de_trabajo,
                cantidad: datos.cantidadEntrada,
                cantidad_restante: cantidad_restante,
                cantidad_producida: datos.unidadesProducidas,
                referencia: datos.referencia,
                orden_produccion: datos.ordenProduccion
            }
            })
        return datosFiltrados
       }}; 

    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
    }
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }

    return (
            <Row className="p-1 d-flex ms-2">
                <Row className="text-center">
                    <Col><h3><strong>Orden:</strong></h3></Col>
                    <Col> <h3>{infoProduccion()[0].orden_produccion ?? 'N/A'}</h3></Col>
                </Row>
                <Row className="text-center">
                </Row>
                <Row className="d-flex gap-2 text-center">
                    <Col  className="d-flex flex-column gap-2">
                        <Row className="bg-dark rounded" >
                            <h4>Referencia <br /><strong>{infoProduccion()[0].referencia ?? 'N/A'}</strong></h4>
                        </Row>                      
                        <Row className="rounded" style={{backgroundColor: '#FFC300'}}>
                            <h4>Producidas <br /><strong>{infoProduccion()[0].cantidad_producida ?? 'N/A'}</strong></h4>
                        </Row>
                    </Col>
                    <Col className="d-flex flex-column gap-2">
                    <Row className="rounded bg-dark" >
                            <h4>Total <br /><strong>{infoProduccion()[0].cantidad ?? 'N/A'}</strong></h4>
                        </Row>
                    <Row className="rounded" style={{backgroundColor: '#2077B4'}}>
                            <h4>Restantes <br /><strong>{infoProduccion()[0].cantidad_restante ?? 'N/A'}</strong></h4>
                        </Row>
                    </Col>
                </Row>
            </Row>
    )
}
export default InformacionProduccion