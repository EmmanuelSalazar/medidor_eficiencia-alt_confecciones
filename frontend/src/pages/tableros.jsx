import { useState, useEffect } from "react";
import { Container } from 'react-bootstrap'
import TableroMensajes from "../components/tablero/tableroMensajes";
import TableroGrafico from "../components/tablero/tableroGrafica";
import { useSocketListener } from "../hooks/useSocketListener";
function Tablero() {
  const { pantallaActiva, notificacion } = useSocketListener();
  const [isTemporario, setIsTemporario] = useState(false);

  useEffect(() => {
    let timer;

    if (Number(pantallaActiva) === 2 || notificacion?.img !== null) { 
      setIsTemporario(true);
      timer = setTimeout(() => {
        setIsTemporario(false);
      }, 300000);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [pantallaActiva]);


  const cambioDePantalla = () => {
    if(!isTemporario){
      return <TableroGrafico />
    }else{
      return <TableroMensajes notificacion={notificacion?.mensaje} imagen={notificacion?.img || null} />
    }
  }
  return (
   
      <Container className="mt-2" style={{minWidth: '100%'}}>
        {pantallaActiva ? cambioDePantalla() : <TableroGrafico />}
      </Container>
    
  )
}

export default Tablero