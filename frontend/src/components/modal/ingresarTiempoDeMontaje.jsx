import React from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import AlmacenarTiempoDeMontaje from "../../services/api/create/almacenarTiempoDeMontaje";
const TiempoDeMontaje = () => {
    const [visible, setVisible] = React.useState("");
    // ALMACENAR DATOS DE INPUT
    const tiempoDeMontaje = React.useRef();
    const moduloDeMontaje = React.useRef();
    const horarioDeMontaje = React.useRef();
    // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
    const [mensajeDeExito, setMensajeDeExito] = React.useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = React.useState("");
    const [mensajeDeError, setMensajeDeError] = React.useState("");
    const [limite, setLimite] = React.useState(0);
    React.useEffect(() => {
                if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
                    const timer = setTimeout(() => {
                        setMensajeDeExito("");
                        setMensajeDeAlerta("");
                        setMensajeDeError("");
                    }, 3000);
                return () => clearTimeout(timer);
                }
            }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);
    // FUNCION PARA MOSTRAR EL MODAL
    const mostrarModal = () => {
        setVisible(true)
    }
    // FUNCION PARA CERRAR EL MODAL
    const cerrarModal = () => { 
        setVisible(false)
    }
    // LIMITAR TIEMPO DE MONTAJE
     const limitarTiempo = (limiteTiempo) => {
        limiteTiempo = parseInt(limiteTiempo);
        if (limiteTiempo > 55) {
            setMensajeDeAlerta("El tiempo de montaje no puede ser mayor a 55 minutos, en caso de ser mayor, repartir en dos horarios distintos");
            return true
        } else {
            return false
        }
     }
    // FUNCION PARA ENVIAR LOS DATOS DEL MODAL
    const enviarDatos = async () => {
        if (limitarTiempo(tiempoDeMontaje.current.value)) {
            return setMensajeDeAlerta("El tiempo de montaje no puede ser mayor a 55 minutos, en caso de ser mayor, repartir en dos horarios distintos");;
        }
        const datos = {
            "tiempoDeMontaje": tiempoDeMontaje.current.value,
            "moduloDeMontaje": moduloDeMontaje.current.value,
            "horarioDeMontaje": horarioDeMontaje.current.value
        }
        try {
            const respuesta = await AlmacenarTiempoDeMontaje(datos);
            setMensajeDeExito(respuesta)
            setTimeout(() => {
                setVisible(false);
            }, 3000)
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error)
            setVisible(true);
            console.error('Ha ocurrido un error: ', error)
        }
    }
    return (
        <>
            <Button size="sm" variant="primary" onClick={() => mostrarModal()}>Establecer tiempo de montaje</Button>
            <Modal show={visible} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Establecer tiempo de montaje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Ingresa el tiempo de montaje (Minutos)</Form.Label>
                            <Form.Control onChange={(e) => limitarTiempo(e.target.value)} type="number" placeholder="##" ref={tiempoDeMontaje}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Modulo el cual se ver├í afectado</Form.Label>
                            <Form.Control  type="number" placeholder="Modulo" ref={moduloDeMontaje}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Horario en el que se har├í el montaje</Form.Label>
                            <Form.Select ref={horarioDeMontaje}>
                                <option value="1">7:00 AM</option>
                                <option value="2">8:00 AM</option>
                                <option value="3">9:15 AM</option>
                                <option value="4">10:15 AM</option>
                                <option value="5">11:15 AM</option>
                                <option value="6">12:30 M</option>
                                <option value="7">1:30 PM</option>
                                <option value="8">2:30 PM</option>
                                <option value="9">3:41 PM</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={enviarDatos}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default TiempoDeMontaje