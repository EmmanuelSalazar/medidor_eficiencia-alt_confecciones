import React from "react";
import { Container } from 'react-bootstrap'
import TableroMensajes from "../components/tablero/tableroMensajes";
import TableroGrafico from "../components/tablero/tableroGrafica";
function Tablero() {
  const [pantalla, setPantalla] = React.useState(1);
  const [tiempo, setTiempo] = React.useState(3600000);
    // CAMBIO DE TIEMPO
    /* React.useEffect(() => {
      if(pantalla === 1){
        setTiempo(3600000);
        setTimeout(() => {
          cambioDePantalla();
        }, 5000);
      }else{
        setTiempo(150000);
        setTimeout(() => {
          cambioDePantalla();
        }, 5000);
      }
    },[pantalla]) */
    // CAMBIO DE PANTALLA
    const cambioDePantalla = () => {
        const interval = setInterval(() => {
          setPantalla((pantalla) => (pantalla === 1 ? 2 : 1));
        }, tiempo);
        return () => clearInterval(interval);
    }
    // TABLEROS
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

export default Tablero