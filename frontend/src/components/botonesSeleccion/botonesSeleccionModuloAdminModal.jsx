import React from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import datos from '../../utils/json/menuModulos.json'
import { ListaContext as ContextoEnLista} from "../../contexts/actualizarRegistroOperaciones";
import { ContextoModulo } from "../../contexts/botonesSeleccionModuloAdmin";
const BotonesSelModAdminRegOp = () => {
    const {setModuloSeleccionado } = React.useContext(ContextoModulo);
    const { setModulo } = React.useContext(ContextoEnLista);
    const [botonSeleccionado, setBotonSeleccionado] = React.useState(null);
    const botones = datos;
    const handleButtonClick = async (modulo, index) => {
        setBotonSeleccionado(index);
        setModuloSeleccionado(modulo);
        
        try {
            setModulo(parseInt(modulo))
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