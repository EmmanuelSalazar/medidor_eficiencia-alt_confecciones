import React from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import datos from '../../utils/json/menuModulos.json'
import { ListaContext as ContextoEnLista} from "../../contexts/actualizarRegistroOperaciones";
import { ListaContext } from '../../contexts/actualizarOperarios';
import { ListaContext as ContextoEnLista2} from "../../contexts/actualizarReferencias";
const BotonesSelModRegOp = () => {
    const { setModulo } = React.useContext(ListaContext);
    const { setModulo:setModuloReferencia } = React.useContext(ContextoEnLista2);
    const { setModulo:setModuloRegistros } = React.useContext(ContextoEnLista);
    const [botonSeleccionado, setBotonSeleccionado] = React.useState(null);
    const botones = datos;
    const handleButtonClick = async (modulo, index) => {
        window.moduloSeleccionado = modulo;
        setBotonSeleccionado(index);
        try {
            setModulo(parseInt(modulo))
            setModuloReferencia(parseInt(modulo));
            setModuloRegistros(parseInt(modulo))
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