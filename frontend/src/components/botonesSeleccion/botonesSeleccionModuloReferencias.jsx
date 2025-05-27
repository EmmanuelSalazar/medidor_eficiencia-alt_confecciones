import React, { useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarReferencias';
import datos from '../../utils/json/menuModulos.json'
const BotonesSeleccionModulos = () => {
  
    const { setModulo } = React.useContext(ListaContext);
    const handleButtonClick = async (modulo, index) => {
      window.ModuloSeleccionado = modulo;
        try {
            setModulo(parseInt(modulo));
          } catch (error) {
            console.error("Ha ocurrido un error: ", error)
          }
        setBotonSeleccionado(index)
    }
    const [botonSeleccionado, setBotonSeleccionado] = useState(null);
    const botones = datos;

      return (
        <ButtonGroup>
          {botones.map((boton, index) => (
            <Button key={index} variant={botonSeleccionado === index ? 'primary' : 'secondary'} onClick={() => handleButtonClick(boton.value, index)}>{boton.label}</Button>
          ))}
        </ButtonGroup>
      )
}
export default BotonesSeleccionModulos