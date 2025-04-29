import { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Spin } from 'antd';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
import AlmacenarDatos from '../../services/api/create/almacenarRemision';
const RegistrarDespacho = () => {
    // AÑADIR INPUTS N CANTIDAD DE VECES
    const [input, setInput] = useState([]);
    const agregarInput = () => {
        setInput([...input, input.length + 1]);
    }
    //
    const clienteRef = useRef(null);
    const odpRef = useRef(null);
    const unidadesRef = useRef(null);
    var observacionesRef = useRef(null);
    const formRef = useRef(null);
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
    // CONTEXTOS
    const { data } = useMostrarClientes();
    const { data: produccion } = useMostrarProduccion();
    const { setCliente, setOdp, setUnidades, setObservaciones } = useContext(PlantillaDespachoContext);
    console.log(produccion)
    // ESPERAR A QUE LOS DATOS ESTEN CARGADOS
    if (!data || !produccion) {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin> 
    }
    // MAPEO DE INFORMACION
    const clientes = data.map((datos) => {
        return {
            client_id: datos.client_id,
            nombre: datos.nombre
        }
    })
    const ordenesDeProduccion = produccion.filter((dato) => dato.estado === 1).map((datos) => {
        return {
            opd_id: datos.odp_id,
            orden_produccion: datos.orden_produccion,
        }
    })

    // ENVIAR DATOS AL CONTEXTO
    const cargarDatosCliente = (e) => {
        let seleccionado = parseInt(e.target.value);
        if (seleccionado === 0) {
            setMensajeDeAlerta("Debes seleccionar una opción valida")
            return;
        } else {
            const informacionCliente = data.filter((cliente) => {
                return cliente.client_id === seleccionado
            })
            setCliente(informacionCliente)
        }
    }
    const cargarDatosOPD = (e) => {
        let seleccionado = parseInt(e.target.value);
        if (seleccionado === 0) {
            setMensajeDeAlerta("Debes seleccionar una opción valida")
            return;
        } else {
            const informacionOPD = produccion.filter((opd) => {
                return opd.odp_id === seleccionado
            })
            setOdp(informacionOPD)
        }
       
    }
    const cargarDatosUnidades = (e) => {
        let seleccionado = parseInt(e.target.value);
        if (seleccionado < 0) {
            setMensajeDeAlerta("Las unidades a despachar no pueden ser negativas")
            return;
        }
        setUnidades(seleccionado)
    }
    const cargarObservaciones = (e) => {
        let seleccionado = e.target.value;
        setObservaciones(seleccionado)
    }
    // ENVIAR DATOS AL BACKEND
    const enviarDatos = async (e) => {
        e.preventDefault();
        let observaciones = observacionesRef.current.value === "" ? null : observacionesRef.current.value;
        const values = {
            clientID: clienteRef.current.value,
            odpID: odpRef.current.value,
            unidadesDespachadas: unidadesRef.current.value,
            observaciones: observaciones,
        }
        try {
            var respuesta = await AlmacenarDatos(values);
            if (respuesta.ok) {
                setMensajeDeExito(respuesta.respuesta);
                formRef.current.reset();
                respuesta = null;
                return;
            } else {
                console.log(respuesta)
                setMensajeDeError(respuesta.respuesta || "Ha ocurrido un error al registrar el despacho, si el error persiste, contacta al administrativo");
                respuesta = null;
                return;
            }
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error al registrar el despacho, si el error persiste, contacta al administrativo");
            console.log(error)
            return;
        }
    }
    return (
        <Form onSubmit={enviarDatos} ref={formRef} className='d-flex flex-column gap-3'>
            <Form.Text className='noImprimir'>
            Al seleccionar los datos, se actualizara la información de la plantilla de remisión
            </Form.Text>
                {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <Form.Group className='noImprimir'>
                <Form.Label>Selecciona el cliente</Form.Label>
                <Form.Select ref={clienteRef} onChange={cargarDatosCliente} required>
                    <option value={0} className='disabled'>Selecciona un cliente</option>
                {clientes.map((cliente) => {
                    return (
                        <option value={cliente.client_id} key={cliente.client_id}>{cliente.nombre}</option>
                    )
                })}
                </Form.Select>

            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Selecciona la orden de producción</Form.Label>
                <Form.Select ref={odpRef} onChange={cargarDatosOPD} required>
                    <option value={0} className='disabled'>Selecciona una orden de producción</option>
                {ordenesDeProduccion.map((orden) => {
                    return (
                        <option value={orden.opd_id} key={orden.opd_id}>{orden.orden_produccion}</option>
                    )
                })}
                </Form.Select>
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Unidades a despachar</Form.Label>
                <Form.Control ref={unidadesRef} onChange={cargarDatosUnidades} type="number" placeholder="Ingresa las unidades a despachar" required />
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control ref={observacionesRef} onChange={cargarObservaciones} as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Button variant="secondary">Agregar despacho</Button>
                <Button variant="primary" type="submit">
                    Registrar despacho
                </Button>
            </Form.Group>
        </Form>
    )
}
export default RegistrarDespacho;