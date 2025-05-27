import React, { useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarRegistros'
import { ListaContext as ContextoLista } from '../../contexts/informacionGrafico'
import datos from '../../utils/json/menuModulos.json'
const BotonesSeleccionModulos = () => {
    const { listaActualizada } = React.useContext(ListaContext);
    const { setModulo } = React.useContext(ContextoLista);
    const handleButtonClick = async (modulo, index) => {
      window.ModuloSeleccionado = modulo;
      const fechaSeleccionada = window.fechaSeleccionada;
        try {
            setModulo(parseInt(modulo));
            await listaActualizada(fechaSeleccionada, modulo);
          } catch (error) {
            console.error("Ha ocurrido un error: ", error)
          }
        setBotonSeleccionado(index)
    }
/*     console.log(listaRegistro);
 */    const [botonSeleccionado, setBotonSeleccionado] = useState(null);
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