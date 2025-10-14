import { useState, useContext, useEffect } from 'react';
import { Table, Spin, Tooltip } from 'antd';
import { Alert, Button } from 'react-bootstrap';
import { EyeOutlined } from '@ant-design/icons';
import useMostrarRemisiones from '../../hooks/mostrarRemisiones.hook';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import { FetchRemisionDetallada } from '../../services/api/read/mostrarRemisiones';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
const ListaRemision = () => {
    const { data, status, error } = useMostrarRemisiones();
    const { data:clientes } = useMostrarClientes();
    const { setCliente, setObservaciones, setDespachos, setFecha, setNumeroRemision, setCargando } = useContext(PlantillaDespachoContext);
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

    if (data === undefined) {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
    }

    const cargarRemision = async (remision) => {
        const remisionNumero = remision.numeroDeRemision;
        console.log(remision)
        var infoRemision = {
            numeroDeRemision: remisionNumero,
            client_id: remision.client_id,
            fecha: remision.fecha,
        };
        try {
            setCargando(true);
            const remisionDetallada = await FetchRemisionDetallada(remisionNumero);
            infoRemision.datosFiltrados = remisionDetallada;
                cargarDatos(infoRemision);
        } catch (error) {
            setMensajeDeError(error.message);
        } finally {
            setCargando(false);
        }
    }

    const cargarDatos = (arreglo) => {
        // DATOS DEL CLIENTE
        const datosCliente = clientes.filter((cliente) => cliente.client_id === arreglo.client_id)
        setCliente(datosCliente)
        // CARGAR NUMERO DE REMISION
        setNumeroRemision(arreglo.numeroDeRemision);
        // OBSERVACIONES
        setObservaciones(arreglo.observaciones);
        console.log(arreglo);
        // DATOS DE LAS ODP
        const datosODP = arreglo.datosFiltrados.map((dato) => {
            return {
                id: Date.now(),
                odp_id: dato.odp_id,
                unidadesDespachadas: dato.unidadesDespachadas,
                bajas: dato.segundasDespachadas,
                unidadesBajas: dato.bajas, // OBTENER LAS UNIDADES DE BAJ
                sumatoria: dato.unidadesDespachadas + dato.segundasDespachadas,
                estado: 1,
                modificable: 0,
                informacionODP: [{
                    orden_produccion: dato.orden_produccion,
                    referencia: dato.referencia,
                    detalle: dato.detalle,
                    talla: dato.talla,
                    color: dato.color,
                }],
            }
        })
        setDespachos(datosODP)
        // FECHA
        setFecha(arreglo.fecha)
        setMensajeDeExito("Los datos se han cargado correctamente");
    }
    const columns = [
        {
            title: 'Nro. de remisión',
            dataIndex: 'numeroDeRemision',
            key: 'numeroDeRemision',
            width: 100
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            width: 100
        },
        {
            title: 'Ordenes despachadas',
            dataIndex: 'OrdenesDespachadas',
            key: 'unidadesDespachadas',
            width: 100
        },{
            title: 'Und. despachadas',
            dataIndex: 'TotalUnidadesProducidas',
            key: 'unidadesDespachd',
            width: 100
        },
        {
            title: 'Observaciones',
            dataIndex: 'observaciones',
            key: 'observaciones',
            width: 110
        },
        {
            title: 'Fecha de remisión',
            dataIndex: 'fecha',
            key: 'fechaRemision',
            width: 100
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            width: 80,
            fixed: 'right',
            render: (text, record) => (
                <Tooltip title='Ver remisión'>
                    <Button onClick={() => cargarRemision(record)}>
                        <EyeOutlined />
                    </Button>
                </Tooltip>  
            )
        }
    ]
    if (status === 'pending') return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
    if (status === 'error') return <Alert variant='danger'>Error: {error.message}</Alert>;
    return (
        <>
            {mensajeDeExito && <Alert variant='success'>{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant='warning'>{mensajeDeAlerta}</Alert>}
            {mensajeDeError && <Alert variant='danger'>{mensajeDeError}</Alert>}
        <Table size='middle' scroll={{y: 500}} pagination={false} rowKey='numeroDeRemision' columns={columns} dataSource={data} />
        </>
    )
}
export default ListaRemision;