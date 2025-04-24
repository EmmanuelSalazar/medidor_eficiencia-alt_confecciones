import { Table, Tag, Spin } from 'antd'
import { Alert } from 'react-bootstrap'
import useMostrarProduccion from '../../hooks/mostrarProduccion.hook';
const ListaProduccion = () => {
    const { data, status, error } = useMostrarProduccion();
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
    const columns = [
        { title: 'Orden de produccion', dataIndex: 'orden_produccion', key: 'orden_produccion', width: 150 },
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia', width: 100 },
        { title: 'Talla', dataIndex:'talla', key:'talla', width: 65 },
        { title: 'Color', dataIndex:'color', key:'color', width: 70 },
        { title: 'Cantidad', dataIndex:'cantidad', key:'cantidad', width: 90 },
        { title: 'Restante', dataIndex:'cantidad_producida', key:'cantidad_producida', width: 90 },
        { title: 'Estado', dataIndex:'estado', key:'estado', render: (estado) => establecerEstados(estado), width: 100  },
        { title: 'Días de trabajo', dataIndex:'DiasDeTrabajo', key:'cantidad_producida', width: 90 },
        { title: 'Fecha de inicio', dataIndex:'fecha_inicio', key:'fecha', width: 110 },
        { title: 'Fecha de actualización', dataIndex:'fecha_final', key:'fecha', width: 116 }
    ]
    // MANEJO DEL ESTADO DE LA SOLICITUD
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    return (
        <Table rowKey='odp_id' columns={columns} dataSource={data}  scroll={{y: 600}}/>
    )
}
export default ListaProduccion