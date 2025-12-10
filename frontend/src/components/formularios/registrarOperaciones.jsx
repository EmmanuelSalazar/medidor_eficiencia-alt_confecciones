import { useRef, useState, useEffect, useContext } from "react";
import { Button, Form, Alert, Col, Stack } from "react-bootstrap";
import { Switch, Checkbox, Spin } from "antd";
import AlmacenarDatos from "../../services/api/create/almacenarRegistroOperaciones";
import { ListaContext as ContextoEnLista } from "../../contexts/actualizarRegistroOperaciones";
import { ListaContext, ListaProvider } from "../../contexts/actualizarOperarios";
import { throttle } from "lodash";

const RegistrarOperaciones = () => {
    // CONTEXTOS
    const { lista, setOperariosRetirados, setRegistroMultipleActivo } = useContext(ListaContext);
    const { actualizarLista, status, error, ordenesDeProduccionModulo, statusOrdenes, errorOrdenes } = useContext(ContextoEnLista);
    // ACTIVAR/DESACTIVARR REGISTROS MULTIPLES/COMENTARIOS ADICIONALES
    const [registroMultiple, setRegistroMultiple] = useState(true);
    const [comentarios, setComentarios] = useState(false);
    // ORDENES DE PRODUCCION
    const ordenRef = useRef({});
    // ALMACENAR FORMULARIO
    const operarioRef = useRef();
    const unidadesProducidasRef = useRef();
    const referenciaRef = useRef();
    const adicionalesRef = useRef();
    const formRef = useRef(null);
    const opRef = useRef(null)
    const [refId, setRefId] = useState(0)
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
    // ACTIVAR/DESACTIVAR REGISTROS MULTIPLES
    useEffect(() => {
        try {
            setOperariosRetirados();
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
        }
    }, [registroMultiple]);
    // ACTUALIZAR ORDENES DE PRODUCCION
    useEffect(() => {
        if(!refId) {
            setRefId(ordenesDeProduccionModulo?.[0]?.ref_id);
        }
    })
    useEffect(() => {
        if (ordenesDeProduccionModulo) {        
            ordenRef.current = ordenesDeProduccionModulo;
        }
    }, [ordenesDeProduccionModulo, refId])
    const activarRegistroMultiple = (valor) => {
        if (!valor) {
        setRegistroMultiple(valor);
        setRegistroMultipleActivo(valor);
        } else {
        setRegistroMultiple(valor);
        setRegistroMultipleActivo(valor);
        }
    };
    const activarComentarios = (checked) => {
        setComentarios(checked); // Actualiza el estado basado en el valor del checkbox
    };
    const obtenerOP = (op) => {
        const odpl = ordenRef.current;
        return odpl.filter(item => item.ordenProduccion == op);
    }
    const enviarDatos = async () => {
        const opInfo = obtenerOP(opRef.current.value);
        if(!opInfo){
            setMensajeDeError("Los datos de la orden no se han cargado aún.");
            return;
        }
        const values = {
            orden: {
                orden: opInfo?.[0]?.ordenProduccion,
                unidadesDisponibles: opInfo?.[0]?.cantidadEntrada,
            },
            operario: operarioRef.current.value,
            unidadesProducidas: unidadesProducidasRef.current.value,
            referencia: opInfo?.[0]?.ref_id,
            adicionales: adicionalesRef.current.value ?? null,
            modulo: window.moduloSeleccionado,
        };
        if (window.moduloSeleccionado == "" || window.moduloSeleccionado == null){
            setMensajeDeError("No se ha seleccionado un modulo");
            return;
        }
        console.log(values);
        try {
            await AlmacenarDatos(values);
            await actualizarLista();
            setMensajeDeExito("El registro se ha guardado correctamente");
            setOperariosRetirados(prevOperarios => [...prevOperarios, parseInt(values.operario)]);
            formRef.current.reset();
        } catch (error) {
            setMensajeDeError(error);
            console.error(error);
        }
    }
    // THROTTLING PARA LIMITAR LA CANTIDAD DE LLAMADAS A LA API
    const throttlingFormulario = useRef(
        throttle(async () => {
            await enviarDatos();
        }, 2000, { leading: true, trailing: false  })
    ).current;
    // ALMACENAR, ENVIAR Y ACTUALIZAR INFORMACIÓN
    const handleSubmit = async (e) => {
        e.preventDefault();
        throttlingFormulario()
    };

     if (status === 'loading' || statusOrdenes === 'loading') return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
     if (error || errorOrdenes) return <Alert variant='danger'>Ha ocurrido un error: {error?.message || errorOrdenes?.message}</Alert>;
    return (
        <Col className="formularioConBotones">
            <ListaProvider>
                <Form className="mx-5" style={{ width: "100%" }} onSubmit={handleSubmit} ref={formRef}>
                    {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
                    {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
                    {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
                    <Form.Group className="mx-5">
                        <Form.Label>Seleccione el operario</Form.Label>
                        <Form.Select required ref={operarioRef} size="lg">
                            {lista.map((dato, index) => (
                                <option key={index} value={dato.op_id}>
                                    {dato.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Seleccione la referencia</Form.Label>
                        <Form.Select required ref={opRef}  onChange={() => setRefId(referenciaRef.current.value)} size="lg">
                            {ordenesDeProduccionModulo?.map((dato, index) => (
                                <option key={index} value={dato.ordenProduccion}>
                                    OP ({dato.ordenProduccion}) - REF ({dato.referencia})
                                </option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Ingrese las unidades producidas</Form.Label>
                        <Form.Control type="number" placeholder="##" required ref={unidadesProducidasRef} size="lg" />
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Checkbox onChange={(e) => activarComentarios(e.target.checked)}>
                            Comentarios adicionales
                        </Checkbox>
                        <Form.Control type="text" placeholder="" ref={adicionalesRef} disabled={!comentarios} />
                    </Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">
                        Registrar Operación
                    </Button>
                </Form>
                <Stack direction="horizontal" className="m-2 my-5" gap={2}>
                    <Switch defaultChecked onChange={(checked) => activarRegistroMultiple(checked)} />
                    <Form.Text>
                        Registro único por operario <strong>Por defecto: Activo</strong>
                    </Form.Text>
                </Stack>
            </ListaProvider>
        </Col>
    );
};

export default RegistrarOperaciones;