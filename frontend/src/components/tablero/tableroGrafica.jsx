import React from "react";
import { Row, Col, Stack} from 'react-bootstrap'
import HorizontalBarChart from '..//graficos/grafico';
import PorcentajeDeEficienciaPorCorte from "..//porcentajeEficienciaDeCorte";
import PorcentajeDeEficienciaDiaria from "..//porcentajeEficienciaDelDia";
import PanelNotificaciones from "..//panelNotificaciones";
import IncentivoQuincena from "..//incentivoQuincena";
import InformacionProduccion from "../panelInformacionProduccion";
import PanelInformacionProduccionGeneralizada from "../panelInformacionProduccionGeneralizada";
import { useSearchParams } from "react-router-dom";
import FechaActual from "../fechaActual";
import { ListaProvider } from "../../contexts/actualizarRegistroOperaciones";
const TableroGrafico = () => {
  const { PanelCompleto } = IncentivoQuincena();
  const {fechaFormateada, corteQuincena} = FechaActual();  
    const [moduloConMarca, setModuloConMarca] = React.useState("");
    // MOSTRAR TABLERO EN USO
    const [buscarParametro] = useSearchParams();
    let moduloEnLaUrl = buscarParametro.get('modulo');
    React.useEffect(() => {
    switch (moduloEnLaUrl) {
        case "1":
            setModuloConMarca("1 (LEONISA)")
        break;
        case "2":
            setModuloConMarca("2 (LESENSUEL)")
        break;
        case "3":
            setModuloConMarca("3 (REYMON)")
        break;
        default:
        setModuloConMarca(`${moduloEnLaUrl || 0} (DESCONOCIDO)`)
        break;
    }
    },[moduloEnLaUrl]);

    return (
        <>
          {/* <Row className="border border-black p-1 mb-2 bg-black bg-opacity-50 rounded text-light">
            <PanelNotificaciones />
          </Row> */}
          <Row>
            <Col lg={3} xs={12} sm={12} md={4} >
              <Row className='border border-black rounded rounded-top rounded-bottom-0  me-1 bg-black  text-light'>
                <ListaProvider>
                  <PanelCompleto />
                </ListaProvider>
              </Row>
              <Row className='border border-black  me-1 bg-black   text-light' >
                <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <div className="p-2"><h4><strong>INCENTIVO QUINCENA</strong></h4></div>
                  <PorcentajeDeEficienciaPorCorte />
                  <div className="p-2"><h5><strong>{corteQuincena}</strong></h5></div>
                </Stack>
              </Row>
              <Row className='border border-black mb-2 me-1 bg-black rounded rounded-top-0  text-light'>
                <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <div className="p-2"><h4><strong>EFICIENCIA DEL DÍA</strong></h4></div>
                  <ListaProvider>
                    <PorcentajeDeEficienciaDiaria />
                  </ListaProvider>
                  <div className="p-2"><h5><strong>{fechaFormateada}</strong></h5></div>
                </Stack>
              </Row>
              <Row className='border border-black me-1 bg-black rounded-top rounded-bottom-0   text-light justify-content-center'>
                  <InformacionProduccion />
              </Row>
              <Row className='border border-black me-1 bg-black rounded rounded-top-0   text-light justify-content-center'>
                  <PanelInformacionProduccionGeneralizada />
              </Row>
            </Col>
            <Col lg={9} xs={12} sm={12} md={4} className='bg-black rounded border border-primary text-light text-center' >            
              <h1 className="text-white"><strong>MODULO {moduloConMarca}</strong></h1>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                    <HorizontalBarChart />
              </div>
            </Col>
          </Row>
        
      </>
    )
}
export default TableroGrafico