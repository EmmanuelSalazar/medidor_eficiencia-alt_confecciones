import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Stack, Spinner, Alert} from 'react-bootstrap'
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
import { ListaContext } from "../../contexts/informacionGrafico";
const TableroGrafico = () => {
  const { PanelCompleto } = IncentivoQuincena();
  const { listaOperarios, status, error } = useContext(ListaContext);
  const {fechaFormateada, corteQuincena} = FechaActual();  
    const [moduloConMarca, setModuloConMarca] = React.useState("");
    const [operatorData, setOperatorData] = useState([]);
    const [revisorData, setRevisorData] = useState([]);
    const [packageData, setPackageData] = useState([]);
    // MOSTRAR TABLERO EN USO
    const [buscarParametro] = useSearchParams();
    let moduloEnLaUrl = buscarParametro.get('modulo');
    useEffect(() => {
    switch (moduloEnLaUrl) {
        case "1":
            setModuloConMarca("1")
        break;
        case "2":
            setModuloConMarca("2")
        break;
        case "3":
            setModuloConMarca("3")
        break;
        default:
        setModuloConMarca(`${moduloEnLaUrl || 0} (DESCONOCIDO)`)
        break;
    }
    },[moduloEnLaUrl]);
    useEffect(() => {
      const operatorData = listaOperarios.filter((operario) => operario.rol === 1)
      setOperatorData(operatorData)
      const revisorData = listaOperarios.filter((operario) => operario.rol === 2)
      setRevisorData(revisorData)
      const packageData = listaOperarios.filter((operario) => operario.rol === 3)
      setPackageData(packageData)
    }, [listaOperarios])
    const styles = {
    width: '1320px',
    height: '1000px',
    display: 'flex',
    justifyContent: 'center',
  };
      if (status === 'loading') {
    return (
      <div style={styles}>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles}>
        <Alert variant="danger">
          Error al cargar los datos: {error.message}
        </Alert>
      </div>
    );
  }
    return (
        <>
          {/* <Row className="border border-black p-1 mb-2 bg-black bg-opacity-50 rounded text-light">
            <PanelNotificaciones />
          </Row> */}
          <Row>
            <Col lg={3} xs={12} sm={12} md={4} >
              <Row className='border border-black rounded rounded-top rounded-bottom-0  me-1 bg-black text-center text-light'>
                <h1 className="text-white mt-2"><strong>MODULO {moduloConMarca}</strong></h1>
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
            <Col lg={9} xs={12} sm={12} md={4} className=' text-center' >            
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
                <div className="bg-black rounded" style={{display: 'flex', justifyContent: 'center'}}>
                      <HorizontalBarChart operatorData={operatorData} graphicHeight="700px" />
                </div>
                <div  className="bg-black rounded" style={{display: 'flex', justifyContent: 'center'}}>
                      <HorizontalBarChart operatorData={revisorData} graphicHeight="180px" verticalFontHeight={35} />
                </div>
                <div  className="bg-black rounded" style={{display: 'flex', justifyContent: 'center'}}>
                      <HorizontalBarChart operatorData={packageData} graphicHeight="115px" verticalFontHeight={35} />
                </div>
              </div>
            </Col>
          </Row>
        
      </>
    )
}
export default TableroGrafico
