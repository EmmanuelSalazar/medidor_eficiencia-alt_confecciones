import { useContext, useState, useEffect, useRef } from 'react';
import { ListaContext } from '../../contexts/actualizarOperarios';
import EliminarOperario from '../../services/api/delete/eliminarOperario';
import ActualizarOperario from '../../services/api/update/actualizarOperario';
import { Table, Spin, Popconfirm } from 'antd';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { reordenarArreglo } from './../utils/organizarArreglo';
const ListaOperarios = () => {
    const { lista, status, error, actualizarLista } = useContext(ListaContext);
    const [mostrar, setMostrar] = useState(false);
    const [operarioSeleccionado, setOperarioSeleccionado] = useState(null);
    const { fetchData } = EliminarOperario();
    const { actualizarOperario } = ActualizarOperario();
    // ALMACENAR DATOS DE FORMULARIO
    const nombreOperarioRef = useRef();
    const moduloRef = useRef();
    const actividadRef = useRef();
    const revisorRef = useRef();
    const posicionRef = useRef();
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
    // FUNCION BOTON "ELIMINAR"
    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await actualizarLista();
            setMensajeDeAlerta("El operario ha sido eliminado");
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
        }
    };
    // ABRIR MODAL Y CARGAR INFORMACION
    const handleShow = (operario) => {
        setOperarioSeleccionado(operario); 
        setMostrar(true)
    };
    // CERRAR MODAL
    const handleClose = () => {
        setOperarioSeleccionado(null); 
        setMostrar(false); 
    };
    // ENVIAR INFORMACION DEL MODAL
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = {
            "nombreOperario": nombreOperarioRef.current.value,
            "modulo": moduloRef.current.value,
            "actividad": actividadRef.current.value,
            "rol" : revisorRef.current.value,
            "posicion": posicionRef.current.value == 0 ? operarioSeleccionado.posicion : posicionRef.current.value
        };
        try {
            await actualizarOperario(operarioSeleccionado.op_id, false, values);
            await actualizarLista();
            setMensajeDeExito("El operario ha sido actualizado con exito");
            setMostrar(null)
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
            console.error("Ha ocurrido un error: ", error);
        }
    }
    // ROLES
    var roles = [
        { value: 1, label: 'Operario/a' },
        { value: 2, label: 'Revisador/a' },
        { value: 3, label: 'Empaquetador/a' },
        { value: 4, label: 'Revisador/a Meta Normal' },
    ];
    // ORDENAR ROLES
    roles = reordenarArreglo(roles, operarioSeleccionado?.rol)
    // MARCAR POSICION

    // COLUMNAS DE LA TABLA
    const columns = [
        { title: 'ID', dataIndex: 'op_id', key: 'op_id', width: 65 },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', width: 100 },
        { title: 'Modulo', dataIndex: 'modulo', key: 'modulo', width: 83},
        { title: 'Estado', dataIndex: 'estado', key: 'estado', width: 76 },
        { title: 'Rol', dataIndex: 'Rol', key: 'rol', width: 100 },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <span>
                    
                    <Button variant="warning" className="mx-1 mb-1" onClick={() => handleShow(record)}>
                        Editar
                    </Button>
                    <Popconfirm
                    title="Eliminar operario" description="┬┐Est├ís seguro de eliminar este operario?" onConfirm={() => handleDelete(record.op_id)} okText="S├¡" cancelText="No">
                        <Button variant="danger" className="mx-1 mb-1">
                            Eliminar
                        </Button>
                    </Popconfirm>
                </span>
            ),
            fixed: 'right'
            , width: 100
        },
    ];

    if (status === 'loading') return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    if (error) return <Alert variant='danger'>Error: {error.message}</Alert>;
    return (
        <div>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
            {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <div className='bg bg-primary bg-opacity-25 p-2 rounded my-1'>
                <span>En este modulo hay <strong>{lista.filter((item) => item.activo === 1).length}</strong> operarios/as</span>
            </div>
            <Table dataSource={lista} columns={columns} rowKey="op_id" scroll={{y: 500}} pagination={false} />

            <Modal show={mostrar} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Operario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {operarioSeleccionado && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" defaultValue={operarioSeleccionado.nombre} required ref={nombreOperarioRef}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Módulo</Form.Label>
                                <Form.Control type="number" defaultValue={operarioSeleccionado.modulo} required ref={moduloRef}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Activo / Inactivo</Form.Label>
                                <Form.Select ref={actividadRef}>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select ref={revisorRef}>
                                    {
                                        roles.map((item) => {
                                            return (
                                                <option key={item.value} value={item.value}>{item.label}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                    <Form.Label>Posicion del operario</Form.Label>
                                    <Form.Select ref={posicionRef}>
                                        <option value="0">Seleccionar posición</option>    
                                        {lista.map((item, index) => {
                                            return (
                                                <option key={item.op_id} value={index+1}>{index+1}</option>
                                            )
                                        })
                                        }
                                    </Form.Select>
                                    <Form.Text>
                                        La posicion actual es: <strong>{operarioSeleccionado.posicion}</strong>
                                    </Form.Text>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} type='submit'>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaOperarios;