import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Form, Alert, Col } from 'react-bootstrap'
import AlmacenarOperario from '../../services/api/create/almacenarOperario'
import { ListaContext } from "../../contexts/actualizarOperarios";

const AgregarOperarios = () => {
    // CONTEXTOS
    const { actualizarLista } = useContext(ListaContext);
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
            const nombreOperarioRef = useRef();
            const moduloRef = useRef();
            const formRef = useRef(null);
    // PROCESAR Y ENVIAR INFORMACIÓN INFORMACIÓN
            const handleSubmit = async (e) => {
                e.preventDefault();
                const values = {
                    "nombreOperario": nombreOperarioRef.current.value,
                    "modulo": moduloRef.current.value
                };
                try {
                    await AlmacenarOperario(values)
                    const modulo = window.ModuloSeleccionado;
                    await actualizarLista(modulo);
                    setMensajeDeExito("El operario se ha guardado correctamente");
                    formRef.current.reset();
                } catch (error) {
                    setMensajeDeError("Ha ocurrido un error, si este persiste, contacte al administrador: ", error);
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
                        <Form.Label>Ingresa el nombre del operario</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" required ref={nombreOperarioRef}/>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Ingresa el modulo al cual pertenece</Form.Label>
                        <Form.Control type="text" placeholder="##" required ref={moduloRef}/>
                    </Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">Registrar operario</Button>
                </Form>
            </Col>
            
        )

}
export default AgregarOperarios