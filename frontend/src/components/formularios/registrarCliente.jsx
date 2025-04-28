import { useRef, useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AlmacenarClientes from '../../services/api/create/almacenarCliente';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
const RegistrarCliente = () => {
    // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
    const [mensajeDeExito, setMensajeDeExito] = useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
    const [mensajeDeError, setMensajeDeError] = useState("");
    const { reload } = useMostrarClientes();
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
    // ALMACENAR DATOS
    const formRef = useRef(null);
    const nombreRef = useRef(null);
    const direccionRef = useRef(null);
    const ciudadRef = useRef(null);
    const telefonoRef = useRef(null);
    const nitRef = useRef(null);
    const almacenarCliente = async (e) => {
        e.preventDefault();
        const datos = {
            nombre: nombreRef.current.value,
            direccion: direccionRef.current.value,
            ciudad: ciudadRef.current.value,
            telefono: telefonoRef.current.value,
            nit: nitRef.current.value
        }
        try {
            await AlmacenarClientes(datos);
            formRef.current.reset();
            setMensajeDeExito('Cliente registrado correctamente');
            await reload();
        } catch(error) {
            setMensajeDeError('Ha ocurrido un error, si este persiste, contacte al administrador');
            console.error('Error al almacenar el cliente', error);
        }
    }
    return (
        <>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
            {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <Form ref={formRef} onSubmit={almacenarCliente} className='d-flex flex-column gap-3'>
                <Form.Group>
                    <Form.Label>Nombre del cliente</Form.Label>
                    <Form.Control ref={nombreRef} type="text" placeholder="Ej: Alt-Confecciones..." required/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dirección del cliente</Form.Label>
                    <Form.Control ref={direccionRef} type="text" placeholder="Ej: Calle/Carrera 99 #99-99" required/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Ciudad/Municipio del cliente</Form.Label>
                    <Form.Control ref={ciudadRef} type="text" placeholder="Ej: Bogotá, Medellín, Itagüí, etc..." required/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Teléfono del cliente</Form.Label>
                    <Form.Control ref={telefonoRef} type="number" placeholder="Ej: 999-999-99-99" required/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>NIT del cliente</Form.Label>
                    <Form.Control ref={nitRef} type="number" placeholder="NIT" required/>
                </Form.Group>
                <Form.Group>
                    <Button variant='primary' type='submit'>Registrar</Button>
                </Form.Group>
            </Form>
        </>
    )
}
export default RegistrarCliente;