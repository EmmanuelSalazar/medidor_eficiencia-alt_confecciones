import { useState, useContext, useEffect } from 'react';
import { Table, Spin, Tooltip } from 'antd';
import { Alert, Button } from 'react-bootstrap';
import { EyeOutlined } from '@ant-design/icons';
import useMostrarRemisiones from '../../hooks/mostrarRemisiones.hook';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
import { PlantillaDespachoContext } from '../../contexts/plantillaDespacho';
const ListaRemision = () => {
    const { data, status, error } = useMostrarRemisiones();
    console.log(data);
    const { data:clientes } = useMostrarClientes();
    const { setCliente, setObservaciones, setDespachos, setFecha, setNumeroRemision } = useContext(PlantillaDespachoContext);
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
    // REORGANIZAR Y AGRUPAR LOS DATOS
    function agruparArreglo(datos) {
        const datosFiltrados = datos.filter((item) => item.bajas === 0);
        const grupos = datosFiltrados.reduce((a, b) => {
            const clave = b.numeroDeRemision;
            if (!a[clave]) {
                a[clave] = [];
            }
            a[clave].push(b);
            return a;
        }, {});
        const arregloAgrupado = Object.keys(grupos).map(clave => {
            const primerElemento = grupos[clave][0];
            return {
                numeroDeRemision: Number(clave),
                orden_produccion: primerElemento.orden_produccion,
                nombreCliente: primerElemento.nombreCliente,
                referencia: primerElemento.referencia,
                ordenesDespachadas: grupos[clave].length, // Obtener la longitud del grupo para obtener el número de ordenes de despachadas
                unidadesDespachadas: grupos[clave].reduce((a, b) => a + b.unidadesDespachadas, 0),
                bajas: grupos[clave].reduce((a, b) => a + b.segundasDespachadas, 0),
                observaciones: primerElemento.observaciones,
                fecha: primerElemento.fecha,
            }
        })
        return arregloAgrupado;
    }
    // INICIAR FUNCION Y ORGANIZAR ARREGLO
    let arregloArreglado = agruparArreglo(data);
    arregloArreglado.sort((a,b) => b.numeroDeRemision - a.numeroDeRemision)
    // CARGAR DATOS AL CONTEXTO
    const cargarDatos = (arreglo) => {
        const datosFiltrados = data.filter((item) => item.numeroDeRemision === arreglo.numeroDeRemision);
        // DATOS DEL CLIENTE
        const datosCliente = clientes.filter((cliente) => cliente.client_id === datosFiltrados[0].client_id)
        setCliente(datosCliente)
        // CARGAR NUMERO DE REMISION
        setNumeroRemision(arreglo.numeroDeRemision);
        // OBSERVACIONES
        setObservaciones(datosFiltrados[0].observaciones);
        // DATOS DE LAS ODP
        const datosODP = datosFiltrados.map((dato) => {
            return {
                id: Date.now(),
                odp_id: dato.odp_id,
                unidadesDespachadas: dato.unidadesDespachadas,
                bajas: dato.segundasDespachadas,
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
        setFecha(datosFiltrados[0].fecha)
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
            dataIndex: 'nombreCliente',
            key: 'cliente',
            width: 100
        },
        {
            title: 'Ordenes despachadas',
            dataIndex: 'ordenesDespachadas',
            key: 'unidadesDespachadas',
            width: 100
        },{
            title: 'Und. despachadas',
            dataIndex: 'unidadesDespachadas',
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
                    <Button onClick={() => cargarDatos(record)}>
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
        <Table size='middle' scroll={{y: 500}} pagination={false} rowKey='numeroDeRemision' columns={columns} dataSource={arregloArreglado} />
        </>
    )
}
export default ListaRemision;