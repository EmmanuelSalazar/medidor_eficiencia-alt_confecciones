import { useContext, useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Spin } from 'antd';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
const RegistrarDespacho = () => {
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
    const ordenesDeProduccion = produccion.map((datos) => {
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
        setUnidades(seleccionado)
    }
    const cargarObservaciones = (e) => {
        let seleccionado = e.target.value;
        setObservaciones(seleccionado)
    }
    return (
        <Form className='d-flex flex-column gap-3'>
            <Form.Text className='noImprimir'>
            Al seleccionar los datos, se actualizara la información de la plantilla de remisión
            </Form.Text>
                {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <Form.Group className='noImprimir'>
                <Form.Label>Selecciona el cliente</Form.Label>
                <Form.Select onChange={cargarDatosCliente}>
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
                <Form.Select onChange={cargarDatosOPD}>
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
                <Form.Control onChange={cargarDatosUnidades} type="number" placeholder="Ingresa las unidades a despachar" />
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control onChange={cargarObservaciones} as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Button variant="primary" type="submit">
                    Registrar despacho
                </Button>
            </Form.Group>
        </Form>
    )
}
export default RegistrarDespacho;