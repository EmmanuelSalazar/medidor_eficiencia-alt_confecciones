import React from "react";
import { Form, Col, Row, Container, Button, Alert } from 'react-bootstrap'
import { Spin } from "antd";
import IniciarSesion from "../../services/api/auth/login";
import logo from '../../assets/img/logo.png'
const FormularioLogin = () => {
    const {exito, error, cargando, iniciarSesion} = IniciarSesion();
    const usuarioRef = React.useRef();
    const contrasenaRef = React.useRef();
    // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
    const [mensajeDeExito, setMensajeDeExito] = React.useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = React.useState("");
    const [mensajeDeError, setMensajeDeError] = React.useState("");
    React.useEffect(() => {
        if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
            const timer = setTimeout(() => {
                setMensajeDeExito("");
                setMensajeDeError("");
                setMensajeDeAlerta("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);
    const enviarDatos = async (e) => {
        e.preventDefault();
        const values = {
            usuario: usuarioRef.current.value,
            contrasena: contrasenaRef.current.value
        }
        try {
            await iniciarSesion(values);
            setMensajeDeExito("Se ha iniciado sesión correctamente")
            location.reload();
        } catch (error) {
            setMensajeDeError(`Ha ocurrido un error: ${error}`); 
            console.log(error);
        }
    }
    if (cargando) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    if (error) return <Alert variant='danger'>Error: {error.message}</Alert>;
    return (
        <Container style={{height: '90vh', display: 'flex', flexDirection: 'column', gap: '5rem'}} className="justify-content-top mt-5" >
            <Row className="text-center text-bg-primary rounded mb-5x">
                <h1>Para utilizar este sistema, deberá iniciar sesión</h1>
            </Row>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
            {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <Row className="justify-content-center align-content-center">
                <Col style={{display: 'flex'}} lg={6} sm={12} md={12} className="flex justify-content-center">
                    <Form onSubmit={enviarDatos} style={{width: '50%', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <Form.Group>
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control ref={usuarioRef} type="text" placeholder="Ingrese su usuario" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control ref={contrasenaRef} type="password" placeholder="Ingrese su contraseña" />
                        </Form.Group>
                        <Form.Group>
                            <Button type="submit">Iniciar Sesión</Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col lg={6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} className="text-primary flex">
                    <img src={logo} alt="logo" style={{width: '40%', height: '100%'}} className="img-fluid" />
                    <h6>Alt-Confecciones</h6>
                </Col>
            </Row>
        </Container>
    )
}
export default FormularioLogin