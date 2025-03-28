import React from "react";
import { Container } from 'react-bootstrap'
import TableroMensajes from "../components/tablero/tableroMensajes";
import TableroGrafico from "../components/tablero/tableroGrafica";
function Modulo() {
  const [pantalla, setPantalla] = React.useState(1);
 
    // CAMBIO DE PANTALLA
    React.useEffect(() => {
      const interval = setInterval(() => {
        setPantalla((pantalla) => (pantalla === 1 ? 2 : 1));
      }, 5000);
      return () => clearInterval(interval);
    },[]);

    const tableroPorcentajes = (
       <TableroGrafico />
      )

  const tableroMensajes = (
        <TableroMensajes />
  )

  

  return (
    <Container className="mt-2" style={{minWidth: '100%'}}>
      {pantalla === 1 ? tableroPorcentajes : tableroMensajes}
    </Container>
  )

}

export default Modulo