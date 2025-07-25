import { useRef, useContext, useState } from 'react';
import { Form, Button, Spinner } from'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarReferencias';
import datos from '../../utils/json/menuModulos.json';
import AlmacenarDatos from '../../services/api/create/almacenarProduccion';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import { coloresUnicos, detallesUnicos} from './../utils/coloresUnicos';
const RegistrarProduccion = () => {
    const [colorUnico, setColorUnico] = useState(false);
    const [detalleUnico, setDetalleUnico] = useState(false);
    // CONTEXTOS
    const { lista, setModulo } = useContext(ListaContext);
    const { reload, data: produccion } = useMostrarProduccion();
    if(produccion) {
        var listaColores = produccion?.datos?.map((item) => {
            return item.color;
        })
        var listaDetalles = produccion?.datos?.map((item) => {
                return item.detalle
        })
    }
    const listaColoresUnicos = coloresUnicos(listaColores);
    const listaDetallesUnicos = detallesUnicos(listaDetalles)
    const { data } = useMostrarClientes();
    // ALMACENAR FORMULARIO
    const formRef = useRef(null);
    const odpRef = useRef();
    const tallaRef = useRef();
    const colorRef = useRef();
    const cantidadRef = useRef();
    const referenciaRef = useRef();
    const moduloRef = useRef();
    const codBarrasRef = useRef();
    const detalleRef = useRef();
    const clienteRef = useRef();
    const comentarioRef = useRef();
    // ESPERAR A QUE CARGUEN LOS DATOS
    if(!data || !lista) return (<Spinner animation="border" variant="primary" />);

    // CARGAR REFERENCIAS SEGÚN MODULO
    const cargarReferencias = async (e) => {
        const modulo = e.target.value;
        setModulo(parseInt(modulo));
    }
    // PROCESAR FORMULARIO
    const alEnviar = async (e) => {
        e.preventDefault();
        const values = {
            modulo: moduloRef.current.value,
            odp: odpRef.current.value,
            talla: tallaRef.current.value,
            color: colorRef.current.value,
            detalle: detalleRef.current.value,
            cantidad: cantidadRef.current.value,
            referencia: referenciaRef.current.value,
            codBarras: codBarrasRef.current.value,
            cliente: clienteRef.current.value,
            comentario: comentarioRef.current.value,
        };
        try {
            await AlmacenarDatos(values);
            formRef.current.reset();
            setColorUnico(false)
            setDetalleUnico(false)
            await reload();
        } catch (error) {
            console.error('Ha ocurrido un error al registrar la produccion', error);
        }
    }
    return (
        <>
            <Form  style={{height: '85vh', overflow: 'auto'}} className='d-flex flex-column gap-2 bg bg-primary p-2 rounded text-light scrollBar'  ref={formRef} onSubmit={alEnviar}>
                <Form.Group>
                    <Form.Label>Orden de produccion</Form.Label>
                    <Form.Control className='selectCustom' placeholder='999999' type="text" ref={odpRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Codigo de barras</Form.Label>
                    <Form.Control className='selectCustom' placeholder='123456789' type="text" ref={codBarrasRef} />
                    <Form.Text className='textSecondary'>
                        Puedes usar el escaner para escanear el codigo de barras o ingresarlo manualmente
                        (Si utilizarás el escaner, selecciona el recuadro de arriba primero)
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Cliente</Form.Label>
                    <Form.Select className='selectCustom' required ref={clienteRef}>
                        <option value="">Seleccione un cliente</option>
                        {data.map((dato, index) => (
                            <option key={index} value={dato.client_id}>
                                {dato.nombre}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Modulo</Form.Label>
                    <Form.Select className='selectCustom' ref={moduloRef} required onChange={cargarReferencias}>
                        <option>Seleccione un modulo</option>
                        {datos.map((dato, index) => (
                            <option key={index} value={dato.value}>
                                {dato.label}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Text className='textSecondary'>
                        Al seleccionar un modulo, se cargara la lista de referencias correspondiente
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                        <Form.Label>Seleccione la referencia</Form.Label>
                        <Form.Select className='selectCustom' required ref={referenciaRef}>
                            {lista.map((dato, index) => (
                                <option key={index} value={dato.ref_id}>
                                    {dato.referencia}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                <Form.Group className='d-flex gap-2 flex-column'>
                    <Form.Label>Detalles</Form.Label>
                    {detalleUnico ? (
                        <Form.Control required className='selectCustom' placeholder='Top, Brasier...' type="text" ref={detalleRef} />
                    ) : (
                        <Form.Select ref={detalleRef} className='selectCustom'>
                            <option>Seleccionar detalle</option>
                                {listaDetallesUnicos.map((item, index) => {
                                    return (
                                        <option key={index} value={item}>{item}</option>
                                    )
                                })}
                        </Form.Select>
                    )}
                    <Form.Check label="Añadir detalle nuevo" onChange={() => setDetalleUnico(!detalleUnico)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Talla</Form.Label>
                    <Form.Control required className='selectCustom' placeholder='34-36-38' type="text" ref={tallaRef} />
                </Form.Group>
                <Form.Group className='d-flex gap-2 flex-column'>
                    <Form.Label>Color</Form.Label>
                    {colorUnico ? (
                        <Form.Control required className='selectCustom' placeholder='Color' type="text" ref={colorRef} />
                    ) : (
                        <Form.Select ref={colorRef} className='selectCustom'>
                            <option>Seleccionar color</option>
                                {listaColoresUnicos.map((item, index) => {
                                    return (
                                        <option key={index} value={item}>{item}</option>
                                    )
                                })}
                        </Form.Select>
                    )}
                    <Form.Check type="checkbox" label="Añadir nuevo color" onChange={() => setColorUnico(!colorUnico)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control required className='selectCustom' placeholder='9999' type="number" ref={cantidadRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Comentarios</Form.Label>
                    <Form.Control className='selectCustom' as="textarea" rows={3} ref={comentarioRef} />
                </Form.Group>
                <Form.Group className='my-4'>
                    <Button className='botonPersonalizado' type='submit'>Registrar</Button> 
                </Form.Group>
            </Form>
        </>
    )
}
export default RegistrarProduccion;