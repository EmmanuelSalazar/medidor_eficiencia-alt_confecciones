import { useRef, useContext } from 'react';
import { Form, Button } from'react-bootstrap';
import { ListaContext } from '../../contexts/actualizarReferencias';
import datos from '../../utils/json/menuModulos.json';
import AlmacenarDatos from '../../services/api/create/almacenarProduccion';
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
const RegistrarProduccion = () => {
    // CONTEXTOS
    const { listas, actualizarListas } = useContext(ListaContext);
    const { reload } = useMostrarProduccion();
    // ALMACENAR FORMULARIO
    const formRef = useRef(null);
    const odpRef = useRef();
    const tallaRef = useRef();
    const colorRef = useRef();
    const cantidadRef = useRef();
    const referenciaRef = useRef();
    // CARGAR REFERENCIAS SEGÚN MODULO
    const cargarReferencias = async (e) => {
        const modulo = e.target.value;
        await actualizarListas(modulo);
    }
    // PROCESAR FORMULARIO
    const alEnviar = async (e) => {
        e.preventDefault();
        const values = {
            odp: odpRef.current.value,
            talla: tallaRef.current.value,
            color: colorRef.current.value,
            cantidad: cantidadRef.current.value,
            referencia: referenciaRef.current.value
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
            <Form className='d-flex flex-column gap-2' ref={formRef} onSubmit={alEnviar}>
                <Form.Group>
                    <Form.Label>Orden de produccion <span className='text-muted'>(referencia)</span></Form.Label>
                    <Form.Control placeholder='999999' type="text" ref={odpRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Modulo</Form.Label>
                    <Form.Select required onChange={cargarReferencias}>
                        {datos.map((dato, index) => (
                            <option key={index} value={dato.value}>
                                {dato.label}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Text className='text-muted'>
                        Al seleccionar un modulo, se cargara la lista de referencias correspondiente
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                        <Form.Label>Seleccione la referencia</Form.Label>
                        <Form.Select required ref={referenciaRef}>
                            {listas.map((dato, index) => (
                                <option key={index} value={dato.ref_id}>
                                    {dato.referencia}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                <Form.Group>
                    <Form.Label>Talla</Form.Label>
                    <Form.Control placeholder='34-36-38' type="number" ref={tallaRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control placeholder='Blanco' type="text" ref={colorRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control placeholder='9999' type="number" ref={cantidadRef} />
                </Form.Group>
                <Form.Group className='my-4'>
                    <Button variant='primary' type='submit'>Registrar</Button> 
                </Form.Group>
            </Form>
        </>
    )
}
export default RegistrarProduccion;