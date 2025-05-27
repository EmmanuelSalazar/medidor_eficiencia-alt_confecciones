import useMostrarProduccion from "../hooks/mostrarProduccion.hook"
import { Spin } from "antd";
import { Alert, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
const PanelInformacionProduccionGeneralizada = () => {
    const [buscarParametro] = useSearchParams();
    let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
    const { data, status, error } = useMostrarProduccion();
    if (!data) {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    }
    const infoProduccion =  () => {
        let informacionFiltrada = data.filter((datos) => datos.modulo === moduloEnLaUrl && datos.estado == 1 || datos.estado == 3)
        // TOTAL DE DÍAS DE TRABAJO DISPONIBLES
        let diasArray = informacionFiltrada.map((datos) => parseFloat(datos.DiasDeTrabajo));
        let diasTotales = diasArray.reduce((a,b) => a + b, 0);
        // REFERENCIAS
        let referencias = informacionFiltrada.map(datos => {
            return {
                referencia: datos.referencia,
                estado: datos.estado
            }
        });
        // UNIDADES POR REFERENCIA
        let unidadesPorReferencia = informacionFiltrada.map((datos) => parseInt(datos.cantidad_producida))
        // TOTAL UNIDADES POR REFERENCIA
        let totalUnidadesPorReferencia = unidadesPorReferencia.reduce((a,b) => a + b, 0);
        return {diasTotales, referencias, unidadesPorReferencia, totalUnidadesPorReferencia};
    }
    return (
        <Row className="p-1 d-flex ms-2">
            <Row className="text-center">
                <Col>
                    <Row>
                    <h3><strong>Días</strong></h3>
                    </Row>
                    <Row>
                        <strong style={{fontSize: '2rem'}} >{Math.round(infoProduccion().diasTotales)}</strong>
                    </Row>
                </Col>
                <Col>
                <Row>
                    <h3><strong>Unidades</strong></h3>
                </Row>
                <Row>
                    <strong style={{fontSize: '2rem'}}>{infoProduccion().totalUnidadesPorReferencia}</strong>
                </Row>
                 </Col>
            </Row>
            <Row className="text-center">
                
            </Row>
            <Row>
                <Col>
                    {infoProduccion().referencias.map((referencia, index) => {
                        return (
                        <table key={index}>
                            <tbody >
                            {referencia.estado === 1 ?
                                <tr>
                                    <td width={50}><div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'BLUE'}}></div></td>
                                    <td style={{fontSize: '1.3rem'}}>Ref: <strong>{referencia.referencia}</strong></td>
                                </tr>
                             :
                             <tr>
                                 <td width={50}><div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'RED'}}></div></td>
                                 <td style={{fontSize: '1.3rem'}}>Ref: <strong>{referencia.referencia}</strong></td>
                             </tr>}
                             </tbody>
                         </table> 
                        )
                    })}
                </Col>
                <Col>
                    {infoProduccion().unidadesPorReferencia.map((unidades, index) => {
                        return (
                            <Row key={index} className="text-center">
                                <h6 style={{fontSize: '1.2rem'}}>UND: <strong>{unidades}</strong></h6>
                            </Row>
                        )
                    })}
                    <Row className="text-center">
                    </Row>
                    
                </Col>
            </Row>
            
        </Row>
    )
}
export default PanelInformacionProduccionGeneralizada