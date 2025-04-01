import React from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import datos from '../../utils/json/menuModulos.json'
import { ListaContext as ContextoEnLista} from "../../contexts/actualizarRegistroOperaciones";
const BotonesSelModAdminRegOp = () => {
    const { setListaRegistro } = React.useContext(ContextoEnLista);
    const [botonSeleccionado, setBotonSeleccionado] = React.useState(null);
    const botones = datos;
    const handleButtonClick = async (modulo, index) => {
        window.moduloSeleccionado = modulo;
        setBotonSeleccionado(index);
        try {
            await setListaRegistro(modulo,window.fechaInicio,window.fechaFin,window.horaInicio,window.horaFin)
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
export default BotonesSelModAdminRegOp;