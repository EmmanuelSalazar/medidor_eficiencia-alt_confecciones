import { useRef, useContext } from 'react';
import { Form, Button, Spinner } from'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarReferencias';
import datos from '../../utils/json/menuModulos.json';
import AlmacenarDatos from '../../services/api/create/almacenarProduccion';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
const RegistrarProduccion = () => {
    // CONTEXTOS
    const { listas, actualizarListas } = useContext(ListaContext);
    const { reload } = useMostrarProduccion();
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
    // ESPERAR A QUE CARGUEN LOS DATOS
    if(!data) return (<Spinner animation="border" variant="primary" />);

    // CARGAR REFERENCIAS SEGÚN MODULO
    const cargarReferencias = async (e) => {
        const modulo = e.target.value;
        await actualizarListas(modulo);
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
            cliente: clienteRef.current.value
        };
        try {
            await AlmacenarDatos(values);
            formRef.current.reset();
            await reload();
        } catch (error) {
            console.error('Ha ocurrido un error al registrar la produccion', error);
        }
    }

    return (
        <>
            <Form  style={{height: '80vh', overflow: 'auto'}} className='d-flex flex-column gap-2 bg bg-primary p-2 rounded text-light scrollBar'  ref={formRef} onSubmit={alEnviar}>
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
                            {listas.map((dato, index) => (
                                <option key={index} value={dato.ref_id}>
                                    {dato.referencia}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                <Form.Group>
                    <Form.Label>Detalles</Form.Label>
                    <Form.Control className='selectCustom' placeholder='Top, Brasier...' type="text" ref={detalleRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Talla</Form.Label>
                    <Form.Control className='selectCustom' placeholder='34-36-38' type="text" ref={tallaRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control className='selectCustom' placeholder='Blanco' type="text" ref={colorRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control className='selectCustom' placeholder='9999' type="number" ref={cantidadRef} />
                </Form.Group>
                <Form.Group className='my-4'>
                    <Button className='botonPersonalizado' type='submit'>Registrar</Button> 
                </Form.Group>
            </Form>
        </>
    )
}
export default RegistrarProduccion;