import { useState, useEffect, useRef } from "react";
import { Button, Form, Alert, Col } from 'react-bootstrap'
import AlmacenarUsuario from "../../services/api/create/almacenarUsuario";
import useMostrarUsuarios from "../../hooks/mostrarUsuarios.hook";
const AgregarUsuarios = () => {
        // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
            const [mensajeDeExito, setMensajeDeExito] = useState("");
            const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
            const [mensajeDeError, setMensajeDeError] = useState("");
            const { reload } = useMostrarUsuarios();
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
                const nombreUsuarioRef = useRef();
                const rolRef = useRef();
                const contrasenaRef = useRef();
                const contrasenaVerRef = useRef();
                const formRef = useRef(null);
        // PROCESAR Y ENVIAR INFORMACIÓN
            const enviarInformacion = async (e) => {
                e.preventDefault();
                if (contrasenaRef.current.value !== contrasenaVerRef.current.value) {
                    setMensajeDeError("Las contraseñas no coinciden");
                    return;
                }
                const values = {
                    "nombreUsuario": nombreUsuarioRef.current.value,
                    "contrasenaUsuario": contrasenaRef.current.value,
                    "rolUsuario": rolRef.current.value
                };
                try {
                    // Aquí deberías llamar a la función que almacena el usuario en la base de datos
                    await AlmacenarUsuario(values)
                    setMensajeDeExito("El operario se ha guardado correctamente");
                    formRef.current.reset();
                    await reload();
                } catch (error) {
                    setMensajeDeError("Ha ocurrido un error, si este persiste, contacte al administrador: ", error);
                    console.error("Ha ocurrido un error: ", error)
                }
            }

return (
    <Col className="formularioConBotones">
                    <Form className="mx-5" style={{width: '100%'}} onSubmit={enviarInformacion} ref={formRef}>
                        {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                        {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                        {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
                        <Form.Group className="mx-5 mb-3">
                            <Form.Label>Ingresa el nombre de usuario</Form.Label>
                            <Form.Control type="text" placeholder="John_Doe" required ref={nombreUsuarioRef}/>
                        </Form.Group>
                        <Form.Group className="mx-5 my-2">
                            <Form.Label>Ingresa la contraseña de acceso</Form.Label>
                            <Form.Control type="text" placeholder="##" required ref={contrasenaRef}/>
                        </Form.Group>
                        <Form.Group className="mx-5 my-2">
                            <Form.Label>Repite la contraseña de acceso</Form.Label>
                            <Form.Control type="text" placeholder="##" required ref={contrasenaVerRef}/>
                        </Form.Group>
                        <Form.Group className="mx-5 my-4">
                            <Form.Label>Selecciona el rol</Form.Label>
                            <Form.Select ref={rolRef} required>
                                <option value="1">Tablero</option>
                                <option value="2">Supervisor/a</option>
                                <option value="3">Administrador/a</option>
                            </Form.Select>
                        </Form.Group>
                        <Button className="mx-5 my-3" variant="primary" type="submit">Registrar usuario</Button>
                    </Form>
                </Col>
)

}

export default AgregarUsuarios;