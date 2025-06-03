import { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Input, Spin } from 'antd';
import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
import AlmacenarDatos from '../../services/api/create/almacenarRemision';
import useLeerCodigoBarras from '../../hooks/useLeerCodigoBarras.hook';
const RegistrarBajas = () => {
    const {valor: codigoDeBarras, timestamp} = useLeerCodigoBarras({minLength: 6, delay: 100 });
    const [barcode, setBarcode] = useState('');
    const [escaneo, setEscaneo] = useState(false);
    const [mostrar, setMostrar] = useState(false);
    // REFERENCIAS FORMULARIO
    const clienteRef = useRef(null);
    const odpRef = useRef(null);
    const unidadesRef = useRef(null);
    var observacionesRef = useRef(null);
    const formRef = useRef(null);
    const segundasRef = useRef(null);
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
    const { setCliente, setObservaciones, despachos, setDespachos, setSumatoriaUnidades, numeroRemision } = useContext(PlantillaDespachoContext);
    // ACTUALIZAR ESCANER
    // ACTUALIZAR UNIDADES POR EL CODIGO DE BARRAS
    const alEscanearCodigoBarras = (codigo) => {
        if (!codigo) return;
            const codigoBuscado = codigo.trim();
        const despachosActualizados = despachos.map((despacho) => {
            const codigoODP = despacho?.informacionODP?.[0]?.codigoBarras?.toString();
                if (codigoODP === codigoBuscado && despacho.estado === 0) {
                    return {
                        ...despacho,
                        unidadesDespachadas: despacho.unidadesDespachadas + 1
                    };
                }
                return despacho;
        });
        setDespachos(despachosActualizados);
    };
    useEffect(() => {
        if (codigoDeBarras && timestamp) {
            alEscanearCodigoBarras(codigoDeBarras);
        }
    }, [timestamp]);
     // CONTAR TOTAL DE UNIDADES
    useEffect(() => {
            const unidadesCompletasArray = despachos.map((despacho) => {
                let unidades = despacho.unidadesDespachadas
                let bajas = despacho.bajas;
                return {unidades, bajas }
            })
            const sumatoriaPrimeras = unidadesCompletasArray.reduce((a,b) => a + b.unidades, 0)
            const sumatoriaSegundas = unidadesCompletasArray.reduce((a,b) => a + b.bajas, 0)
            const primerasConSegundas = sumatoriaPrimeras + sumatoriaSegundas;
            setSumatoriaUnidades(primerasConSegundas)
            // TOTAL POR ODP
            /* const unidadesCompletasPorODP = despachos.map((despacho) => {
                if
            }) */
    }, [despachos])
    // ESPERAR A QUE LOS DATOS ESTEN CARGADOS
    if (!data || !produccion) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin> 
    
    // MAPEO DE INFORMACION
    const clientes = data.map((datos) => {
        return {
            client_id: datos.client_id,
            nombre: datos.nombre
        }
    })
    const ordenesDeProduccion = produccion.filter((dato) => dato.estado === 1 || dato.estado === 3).map((datos) => {
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
            bajas: 0,
            estado: 0
        }])
    }
    const alCambiarOdp = (despachoId, odpId) => {
        const despachosActualizados = despachos.map((despacho) => {
            if (despacho.id === despachoId && despacho.estado === 0) {
                const odpCompleta = produccion.filter((opd) => opd.odp_id === parseInt(odpId))
                return { ...despacho, odp_id: odpId, informacionODP: odpCompleta }
            }
            return despacho;
        });
            setDespachos(despachosActualizados);   
      }
    // SUMATORIAS DE UNIDADES --------------------------------
    const alCambiarUnidades = (despachoId, unidades, tipo) => {
        // PROCESAR UNIDADES INDIVIDUALES
        if (parseInt(tipo) === 1 ) {
            /* PRIMERAS */
            const despachosActualizados = despachos.map((despacho) => {
                if (despacho.id === despachoId && despacho.estado === 0) {
                    const sumatoria = despacho.bajas + parseInt(unidades);
                    return {...despacho, unidadesDespachadas: parseInt(unidades), sumatoria: sumatoria  }
                }
                return despacho;
            });
            setDespachos(despachosActualizados);
        } else  {
            /* SEGUNDAS */
                const despachosActualizados = despachos.map((despacho) => {
                    if (despacho.id === despachoId && despacho.estado === 0) {
                        const sumatoria = despacho.unidadesDespachadas + parseInt(unidades);
                        return {...despacho, bajas: parseInt(unidades), sumatoria: sumatoria }
                    }
                    return despacho;
                });
                setDespachos(despachosActualizados);
            }
    }  
    // ---------------------------------------------------- 
    const alCerrarCaja = (e, id) => {
        const despachosActualizados = despachos.map((despacho) => {
            if (despacho.id === id) {
                let estado = despacho.estado === 1 ? 0 : 1;
                if (estado === 0) {
                    const actualizarOtrosDespachos = despachos.map((despachom) => {
                        if (despachom.codigoBarras === despacho.codigoBarras) {
                            console.log(despachom.estado)
                            return {...despachom, estado: 1}
                        }
                    return despachom
                    })
                    setDespachos(actualizarOtrosDespachos)
                }
                return {...despacho, estado: estado }
            }
        return despacho;
        })
        setDespachos(despachosActualizados);
    }
    const alMarcarBajas = () => {
        setMostrar(!mostrar)
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
                if (despacho.modificable != 0) {
                    let odp = despacho.odp_id;
                    let unidades = despacho.unidadesDespachadas;
                    let segundas = despacho.bajas;
                    return {odp, unidades, segundas}
                } 
            
        })
        let observaciones = observacionesRef.current.value === "" ? null : observacionesRef.current.value;
        const values = {
            clientID: clienteRef.current.value,
            odpInfo : odpInfo.filter((dato) => dato !== undefined),
            remision: numeroRemision,
            baja: 1,
            observaciones: observaciones,
        }
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
        <Form onKeyDown={(e) => {e.key === 'Enter' && e.preventDefault()}} style={{height: '550px', overflow: 'auto'}} onSubmit={enviarDatos} ref={formRef} className='noImprimir d-flex flex-column gap-3'>
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
                        <div key={index} className={`noImprimir border ${despacho.estado === 1 ? 'bg-success border-secondary' : 'bg bg-primary bg-opacity-50 border-primary' } p-2 rounded border-2`}>
                            <Form.Group className={`noImprimir `}>
                                <Form.Label>Selecciona la orden de producción</Form.Label>
                                <Form.Select className={`bg ${despacho.estado === 1 ? '' : 'bg-primary bg-opacity-75 text-white'}`} disabled={despacho.estado === 1 ? true : false} id={index + 1} ref={odpRef} onChange={(e) => alCambiarOdp(despacho.id, e.target.value)} required>
                                        <option value={0} className='disabled'>Selecciona una orden de producción</option>
                                    {ordenesDeProduccion.map((orden) => {
                                        return (
                                            <option value={orden.opd_id} key={orden.opd_id}>{orden.orden_produccion}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='noImprimir '>
                                <Form.Label>Unidades a despachar</Form.Label>
                                <Form.Control disabled={despacho.estado === 1 ? true : false} className={`bg ${despacho.estado === 1 ? '' : 'bg-primary bg-opacity-75 text-white'}`} value={despacho.unidadesDespachadas}  ref={unidadesRef} onChange={(e) => alCambiarUnidades(despacho.id, e.target.value, 1)} type="number"  placeholder="Ingresa las unidades a despachar" required />
                            </Form.Group>
                            <div className='noImprimir d-flex align-items-center mt-2 gap-3 justi'>
                                <Form.Text>
                                    #{index + 1}
                                </Form.Text>
                                <Form.Check disabled={despacho.modificable === 0 ? true : false} checked={despacho.estado === 1 ? true : false} onChange={(e) => {alCerrarCaja(e, despacho.id)}} className='mt-1' type="switch" label="Abrir/Cerrar caja"/>
                                <Form.Check disabled={despacho.estado === 1 ? true : false} onChange={(e) => {alMarcarBajas(e)}} label="Añadir segundas" />
                            </div>
                            <div className={`${mostrar ? '' : 'imprimir'}`} >
                                <Form.Control disabled={despacho.estado === 1 ? true : false} ref={segundasRef} onChange={(e) => alCambiarUnidades(despacho.id, e.target.value, 2)} className={`mt-2 bg ${despacho.estado === 1 ? '' : 'bg-primary bg-opacity-75 text-white'}`}  type='number' placeholder='# de segundas' />
                            </div>
                        </div>  
                     )
                    })}  
            <Form.Group className='noImprimir d-flex gap-2'>
                <Button variant="secondary" onClick={agregarDespacho}>
                <PlusOutlined/> <span >Añadir orden</span>
                </Button>
                <Button variant="danger" onClick={() => setDespachos([])}>
                    Reiniciar formulario
                </Button>
            </Form.Group>
            <Form.Group className='noImprimir'>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control ref={observacionesRef} onChange={cargarObservaciones} as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className='noImprimir d-flex gap-2'>
                    <Button variant="primary" type="submit">
                        Registrar despacho
                    </Button>   
            </Form.Group>
        </Form>
    )
}
export default RegistrarBajas;