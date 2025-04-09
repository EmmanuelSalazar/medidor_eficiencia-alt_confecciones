import React, { useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarRegistros'
import { ListaContext as ContextoLista } from '../../contexts/informacionGrafico'
import datos from '../../utils/json/menuModulos.json'
import FechaActual from "../fechaActual";
const BotonesSeleccionModulos = () => {
    const { listaActualizada } = React.useContext(ListaContext);
    const { actualizarLista, actualizarListaRegistro, listaRegistro } = React.useContext(ContextoLista);
      const {fechaActualDia, corteQuincenaFormateado, anioActual} = FechaActual();
        let corteQuincena = `${anioActual}-${corteQuincenaFormateado[0].fechaInicial}`;
    
    const handleButtonClick = async (modulo, index) => {
      window.ModuloSeleccionado = modulo;
      const fechaSeleccionada = window.fechaSeleccionada;
        try {
            await actualizarListaRegistro(window.ModuloSeleccionado, corteQuincena, null, null, null, 1, 1);
            await actualizarListaRegistro(window.ModuloSeleccionado, fechaActualDia, null, null, null, 1, 0);
            await actualizarLista(fechaSeleccionada, modulo);
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