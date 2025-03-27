import React from "react";
import {Container, Row, Col} from 'react-bootstrap'
import HorizontalBarChart from '../components/graficos/grafico';
import PorcentajeDeEficienciaPorCorte from "../components/porcentajeEficienciaDeCorte";
import PorcentajeDeEficienciaDiaria from "../components/porcentajeEficienciaDelDia";
import PanelNotificaciones from "../components/panelNotificaciones";
import IncentivoQuincena from "../components/incentivoQuincena";
import { useSearchParams } from "react-router-dom";
import logo from '../assets/img/logo.png'
function Modulo() {
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
    <Container className="mt-2" style={{minWidth: '100%'}}>
        <Row className="border border-black p-1 mb-2 bg-black bg-opacity-50 rounded text-light">
          <PanelNotificaciones />
        </Row>
        <Row>
          <Col lg={3} xs={12} sm={12} md={4} >
            <Row className='border border-black mb-2 me-1 bg-black  rounded text-light'>
              <IncentivoQuincena />
            </Row>
            <Row className='border border-black mb-2 me-1 bg-black  rounded text-light' >
              <PorcentajeDeEficienciaPorCorte />
            </Row>
            <Row className='border border-black mb-2 me-1 bg-black  rounded text-light'>
             <PorcentajeDeEficienciaDiaria />
            </Row>
            <Row className='border border-white pe-3 bg-white  rounded text-light justify-content-center'>
              <img src={logo} alt="logo" style={{width: '70%', height: '100%'}} className="img-fluid" />
            </Row>
          </Col>
          <Col lg={9} xs={12} sm={12} md={4} className='bg-black rounded border border-primary text-light text-center' >            
            <h1 className="text-white"><strong>TABLERO MODULO {moduloConMarca}</strong></h1>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                  <HorizontalBarChart />
            </div>
          </Col>
        </Row>
      </Container>
    )
}
export default Modulo