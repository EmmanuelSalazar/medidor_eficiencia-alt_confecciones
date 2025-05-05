import { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Spin, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
import AlmacenarDatos from '../../services/api/create/almacenarRemision';
const RegistrarDespacho = () => {
    // REFERENCIAS FORMULARIO
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
    const { setCliente, setObservaciones, despachos, setDespachos } = useContext(PlantillaDespachoContext);

    // ESPERAR A QUE LOS DATOS ESTEN CARGADOS
    if (!data || !produccion) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin> 
    
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
    const agregarDespacho = () => {
        setDespachos([...despachos, {
            id: Date.now(),
            odp_id: 0,
            unidadesDespachadas: 0,
            observaciones: null,
        }])
    }
    const alCambiarOdp = (despachoId, odpId) => {
        const despachosActualizados = despachos.map((despacho) => {
            if (despacho.id === despachoId) {
                const odpCompleta = produccion.filter((opd) => opd.odp_id === parseInt(odpId))
                return { ...despacho, odp_id: odpId, informacionODP: odpCompleta }
            }
            return despacho;
        });
            setDespachos(despachosActualizados);   
      }
    const alCambiarUnidades = (despachoId, unidades) => {
        const despachosActualizados = despachos.map((despacho) => {
            if (despacho.id === despachoId) {
                return {...despacho, unidadesDespachadas: parseInt(unidades) }
            }
            return despacho;
        });
        setDespachos(despachosActualizados);
    }
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
    const cargarObservaciones = (e) => {
        let seleccionado = e.target.value;
        setObservaciones(seleccionado)
    }
    
    // ENVIAR DATOS AL BACKEND
    const enviarDatos = async (e) => {
        e.preventDefault();
        const odpInfo = despachos.map((despacho) => {
            let odp = despacho.odp_id;
            let unidades = despacho.unidadesDespachadas;
            return {odp, unidades}
        })
        let observaciones = observacionesRef.current.value === "" ? null : observacionesRef.current.value;
        const values = {
            clientID: clienteRef.current.value,
            odpInfo : odpInfo,
            observaciones: observaciones,
        }
        console.log(values)
        try {
            var respuesta = await AlmacenarDatos(values);

                setMensajeDeExito("El registro se ha almacenado exitosamente");
                formRef.current.reset();
                setDespachos([]);
                console.log(respuesta)
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error al registrar el despacho, si el error persiste, contacta al administrativo");
            console.log(error)
            return;
        }
    }
    return (
        <Form style={{height: '550px', overflow: 'auto'}} onSubmit={enviarDatos} ref={formRef} className='noImprimir d-flex flex-column gap-3'>
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
                {despachos.map((despacho, index) => {
                    return (
                        <div key={index} className='noImprimir border p-2 rounded border-2'>
                            <Form.Group className='noImprimir'>
                                <Form.Label>Selecciona la orden de producción</Form.Label>
                                <Form.Select id={index + 1} ref={odpRef} onChange={(e) => alCambiarOdp(despacho.id, e.target.value)} required>
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
                                <Form.Control ref={unidadesRef} onChange={(e) => alCambiarUnidades(despacho.id, e.target.value)} type="number" placeholder="Ingresa las unidades a despachar" required />
                            </Form.Group>
                            <div className='noImprimir'>
                                <Form.Text>
                                    #{index + 1}
                                </Form.Text>
                            </div>
                        </div>  
                     )
                    })}            
            <Form.Group className='noImprimir'>
                <Button variant="secondary" onClick={agregarDespacho}>
                <PlusOutlined/> <span >Añadir orden</span>
                </Button>
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control ref={observacionesRef} onChange={cargarObservaciones} as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className='noImprimir d-flex gap-2'>
                <Popconfirm title="¿Estás seguro de que deseas registrar estos despachos? Al hacerlo, no habrá vuelta a atrás">
                    <Button variant="primary" type="submit">
                        Registrar despacho
                    </Button>
                </Popconfirm>
                
            </Form.Group>
        </Form>
    )
}
export default RegistrarDespacho;