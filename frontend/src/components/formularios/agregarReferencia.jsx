import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Alert, Col } from 'react-bootstrap'
import AlmacenarDatos from '../../services/api/almacenarReferencia'
import { ListaContext } from '../../contexts/actualizarReferencias';
const AgregarReferencia = () => {
    // CONTEXTOS
    const { actualizarListas } = React.useContext(ListaContext);
    // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
    const [mensajeDeExito, setMensajeDeExito] = useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
    const [mensajeDeError, setMensajeDeError] = useState("");
    useEffect(() => {
        if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
            const timer = setTimeout(() => {
                setMensajeDeExito("");
                setMensajeDeError("");
                setMensajeDeAlerta("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);
    // ALMACENAR FORMULARIOS
    const codigoReferenciaRef = useRef();
    const tiempoTareaRef = useRef();
    const moduloRef = useRef();
    const formRef = useRef(null);
    // PROCESAR Y ENVIAR INFORMACIÓN INFORMACIÓN
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = {
            'codigoReferencia': codigoReferenciaRef.current.value,
            'tiempoTarea': tiempoTareaRef.current.value,
            'modulo': moduloRef.current.value,
        }
        try {
            await AlmacenarDatos(values)
            await actualizarListas();
            setMensajeDeExito("La Referencia se ha almacenado correctamente");
            formRef.current.reset();
        } catch (error){
            setMensajeDeError("Ha ocurrido un error, si este persiste, contacte con el administrador: ", error);
            console.error("Ha ocurrido un error: ", error)
        }
    }
    return (
        <Col className="formularioConBotones">
            <Form className="mx-5" style={{width: '100%'}} onSubmit={handleSubmit} ref={formRef}>
                {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el codigo de referencia</Form.Label>
                    <Form.Control type="text" placeholder="Ej: 12345" required ref={codigoReferenciaRef}/>
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el tiempo de esta tarea</Form.Label>
                    <Form.Control type="number" placeholder="Tiempo en minutos" required ref={tiempoTareaRef} step="any"/>
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el modulo al cual pertenece</Form.Label>
                    <Form.Control type="number" placeholder="Ej: 1" required ref={moduloRef}/>
                    <Form.Text>Las referencias recien registradas se marcan como <strong>inactivas</strong>, deberás <strong>activarlas</strong> manualmente</Form.Text>
                </Form.Group>
                <Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">Registrar referencia</Button>
                </Form.Group>
            </Form>
        </Col>
            
    )
}
export default AgregarReferencia