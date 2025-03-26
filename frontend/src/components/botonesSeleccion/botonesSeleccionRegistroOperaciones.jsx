import React from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import datos from '../../utils/json/menuModulos.json'
import { ListaContext as ContextoEnLista} from "../../contexts/actualizarRegistroOperaciones";
import { ListaContext } from '../../contexts/actualizarOperarios';
import { ListaContext as ContextoEnLista2} from "../../contexts/actualizarReferencias";
const BotonesSelModRegOp = () => {
        const { lista, actualizarLista } = React.useContext(ListaContext);
        const { listas, actualizarListas } = React.useContext(ContextoEnLista2);
        const { setListaRegistro } = React.useContext(ContextoEnLista);
    const [botonSeleccionado, setBotonSeleccionado] = React.useState(null);
    const botones = datos;
    const handleButtonClick = async (modulo, index) => {
        window.moduloSeleccionado = modulo;
        setBotonSeleccionado(index);
        try {
            await actualizarLista(modulo, true);
            await actualizarListas(modulo, true);
            await setListaRegistro(modulo)
        } catch (error) {
            console.error("Ha ocurrido un error: ", error)
            throw error;
        }
    }
    return (
        <ButtonGroup>
            {botones.map((boton, index) => (
                <Button key={index} variant={botonSeleccionado === index ? 'primary' : 'secondary'} onClick={() => handleButtonClick(boton.value, index)}>{boton.label}</Button>
            ))}
        </ButtonGroup>
    )
}
export default BotonesSelModRegOp;