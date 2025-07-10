import { useState, useEffect } from 'react';
import { Table, Tag, Spin, Popconfirm } from 'antd'
import { Alert, Button, Modal, Form } from 'react-bootstrap'
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
import ActualizarMarcasDeProcesos from '../../services/api/update/actualizarMarcasProcesos';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ActualizarProduccion from '../../services/api/update/actualizarProduccion';
import EliminarOrdenProduccion from '../../services/api/delete/eliminarOrdenProduccion';
import { colorPorReferencia, colorPorRestante } from './../utils/colorCeldas.lista';
import { coloresUnicos } from '../utils/coloresUnicos';
import moment from 'moment';
const ListaProduccion = () => {
    const { data, status, error, reload } = useMostrarProduccion();
    const { actualizarRegistroOperacion } = ActualizarMarcasDeProcesos();
    if(data) {
        var listaColores = data.map((item) => {
            return item.color;
        });
        var listaColoresUnicos = coloresUnicos(listaColores);
        var listaTallas = data.map((item) => {
            return item.talla;
        })
        var listaTallaUnicas = coloresUnicos(listaTallas);
        var listaReferencias = data.map((item) => {
            return item.referencia;
        })
        var listaReferenciaUnicas = coloresUnicos(listaReferencias);
        var listaClientes = data.map((item) => {
            return item.cliente;
        })
        var listaClienteUnicas = coloresUnicos(listaClientes);
    }
    const { fetchData } = EliminarOrdenProduccion();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [odp, setOdp] = useState();
    const [talla, setTalla] = useState();
    const [color, setColor] = useState();
    const [estado, setEstado] = useState();
    const [odpID, setOdpID] = useState();
    const [detalle, setDetalle] = useState();
    const [referencia, setReferencia] = useState();
    const [comentario, setComentario] = useState();
    const { actualizarProduccion } = ActualizarProduccion();
    const [informacionModal, setInformacionModal] = useState();
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
    const abrirModal = (record) => {
        setMostrarModal(true);
        setInformacionModal(record);
        setOdp(record.orden_produccion);
        setTalla(record.talla);
        setColor(record.color);
        setEstado(record.estado);
        setReferencia(record.referencia);
        setDetalle(record.detalle)
        setComentario(record.comentario)
        setOdpID(record.odp_id);
    }
    const cerrarModal = () => {
        setMostrarModal(false);
    }
    const enviarInformacion = async (e) => {
        setLoading(true);
        e.preventDefault();
        const values = {
            odpID: odpID,
            odp: odp,
            talla: talla,
            referencia: referencia,
            color: color,
            estado: estado,
            detalle: detalle,
            comentario: comentario,
        }
        try {
            await actualizarProduccion(values)
            setMensajeDeExito("El registro se ha actualizado exitosamente");
            setMostrarModal(false);
            await reload();
            setOdp("");
            setTalla("");
            setColor("");
            setEstado("");
            setOdpID("");
            setReferencia("");
            setDetalle("");

        } catch (error) {
            setMensajeDeError("Ha ocurrido un error al actualizar el registro, si el error persiste, contacta al administrativo");
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    const establecerEstados = (estado) => {
        switch (estado) {
            case 1:
                return <Tag color='blue'>En produccion</Tag>
            case 2:
                return <Tag color='green'>Terminada</Tag>
            case 3:
                return <Tag color='orange'>En espera</Tag>
            case 4:
                return <Tag color='red'>Incompleto</Tag>
            default:
                return <Tag color='black'>Desconocido</Tag>
        }
    }
    const alBorrar = async (id) => {
        try {
            await fetchData(id);
            setMensajeDeExito("El registro se ha eliminado exitosamente");
            await reload();
        } catch (error) {
            console.log(error);
/*             setMensajeDeError(error || "Ha ocurrido un error al eliminar el registro, si el error persiste, contacta al administrativo");
 */        }
    }
    // MANEJO DEL ESTADO DE LA SOLICITUD
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    if (loading) return (
        <Spin tip="Cargando..."><div></div></Spin>
    );
    if (error) return <Alert variant="danger">Ha ocurrido un error</Alert>
    // COLUMNAS PARA LA LISTA
    const columns = [
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente', width: 150, filters: [
            ...listaClienteUnicas.map((cliente) => ({
                text: cliente,
                value: cliente,
            })),
        ], onFilter: (value, record) => {
            return String(record.cliente).toUpperCase() === String(value).toUpperCase();
        } },
        { title: 'Orden de produccion', dataIndex: 'orden_produccion', key: 'orden_produccion', width: 150 },
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia', width: 120, onCell: (record) => {
            return colorPorReferencia(record?.referencia);
        }, filters: [
            ...listaReferenciaUnicas.map((referencia) => ({
                text: referencia,
                value: referencia,
            })),
        ], onFilter: (value, record) => {
            return String(record.referencia).toUpperCase() === String(value).toUpperCase();
        } },
        { title: 'Detalles', dataIndex:'detalle', key:'detalles', width: 100},
        { title: 'Talla', dataIndex:'talla', key:'talla', width: 80, filters: [
            ...listaTallaUnicas.map((talla) => ({
                text: talla,
                value: talla,
            })),
        ], onFilter: (value, record) => {
            return String(record.talla).toUpperCase() === String(value).toUpperCase();
        } },
        { title: 'Color', dataIndex:'color', key:'color', width: 135, filters: [
            ...listaColoresUnicos.map((color) => ({
                text: color,
                value: color,
            })),
        ], onFilter: (value, record) => {
            return String(record.color).toUpperCase() === String(value).toUpperCase();
        } },
        { title: 'Cantidad', dataIndex:'cantidad', key:'cantidad', width: 90, onCell: () => {
            return { style: { background: '#5fbf4f'} }
        } },
        { title: 'Restante', dataIndex:'cantidad_producida', key:'cantidad_producida', width: 90, onCell: (record) => {
            return colorPorRestante(record?.cantidad, record?.cantidad_producida);
        } },
        { title: 'Estado', dataIndex:'estado', key:'estado', render: (estado) => establecerEstados(estado), width: 100 },
        { title: 'Comentarios', dataIndex:'comentarios', key:'comentarios', width: 300},
        { title: 'Días de trabajo', dataIndex:'DiasDeTrabajo', key:'cantidad_producida', width: 90 },
        { title: 'Fecha de entrada', dataIndex:'fecha_inicio', key:'fecha', width: 110, sorter: (a, b) => {
            const fechaA = moment(a.fecha_inicio, 'YYYY-MM-DD');
            const fechaB = moment(b.fecha_inicio, 'YYYY-MM-DD');
            return fechaA.diff(fechaB);
        }, defaultSortOrder: 'descend' },
        { title: 'Fecha de entrada a planta', dataIndex:'fecha_ingresoPlanta', key:'fecha', width: 110},
        { title: 'Fecha de salida a planta', dataIndex:'fecha_salidaPlanta', key:'fecha', width: 110},
        { title: 'Fecha de despacho', dataIndex:'fecha_final', key:'fecha', width: 116},
        { title: 'Acciones', dataIndex:'acciones', key:'acciones', render:(text, record) => (
            <div className='d-flex gap-1'>
             <Button variant='primary' onClick={() => abrirModal(record)}><EditOutlined /></Button>
             <Popconfirm title="Eliminar Registro" description="¿Estás seguro de eliminar el registro?" onConfirm={() => alBorrar(record.odp_id)}>
                <Button variant='danger'><DeleteOutlined /></Button>
             </Popconfirm>
            </div>
        ), width: 89, fixed: 'right' },
    ]
    return (
        <>
        {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
        {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
        {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
        <Table rowKey='odp_id' columns={columns} dataSource={data}  scroll={{y: 600}} pagination={false}/>
        <Modal show={mostrarModal} onHide={cerrarModal}>
            <Modal.Header closeButton>
                <Modal.Title>Editar registro</Modal.Title>
            </Modal.Header>
            <Form onSubmit={enviarInformacion} className='d-flex flex-column gap-2'>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Orden de produccion</Form.Label>
                        <Form.Control onChange={(e) => setOdp(e.target.value)} type="text" defaultValue={informacionModal?.orden_produccion}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Referencia</Form.Label>
                        <Form.Control  type="text" defaultValue={informacionModal?.referencia} disabled/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Detalle</Form.Label>
                        <Form.Control onChange={(e) => setDetalle(e.target.value)} type="text" defaultValue={informacionModal?.detalle} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Talla</Form.Label>
                        <Form.Control onChange={(e) => setTalla(e.target.value)} type="text" defaultValue={informacionModal?.talla} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Color</Form.Label>
                        <Form.Control onChange={(e) => setColor(e.target.value)} type="text" defaultValue={informacionModal?.color} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control onChange={(e) => setComentario(e.target.value)} as='textarea' rows={3} placeholder="Ingrese comentarios" defaultValue={informacionModal?.comentarios} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Actualizar estado <Form.Text>(Actual: {establecerEstados(informacionModal?.estado)})</Form.Text></Form.Label>
                        <Form.Select onChange={(e) => setEstado(e.target.value)} disabled={informacionModal?.estado === 2  ? true : false}>
                            <option>Seleccionar</option>
                            <option value="1">En produccion</option>
                            <option value="2">Terminada</option>
                            <option value="3">En espera</option>
                            <option value="4">Incompleto</option>
                        </Form.Select>
                        <Form.Text>
                            Solo puede haber una orden por <strong>modulo</strong> con el estado: {establecerEstados(1)}, por lo que si se actualiza a otro estado, la orden anterior se actualiza automaticamente a {establecerEstados(4)}
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant='warning' onClick={() => actualizarRegistroOperacion({id: informacionModal?.odp_id, tipo: 1})}>Marcar en planta</Button>
                    </div>
                    <Button variant='secondary' onClick={cerrarModal}>Cerrar</Button>
                    <Button variant='primary' type='submit'>Actualizar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        </>
    )
}
export default ListaProduccion