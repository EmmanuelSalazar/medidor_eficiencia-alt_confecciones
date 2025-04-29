import { Table, Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import useMostrarRemisiones from '../../hooks/mostrarRemisiones.hook';
const ListaRemision = () => {
    const { data, status, error } = useMostrarRemisiones();

    const columns = [
        {
            title: 'Orden de produccion',
            dataIndex: 'orden_produccion',
            key: 'ordenProduccion',
        },
        {
            title: 'Cliente',
            dataIndex: 'nombreCliente',
            key: 'cliente',
        },{
            title: 'Referencia',
            dataIndex: 'referencia',
            key: 'referencia',
        },
        {
            title: 'Unidades despachadas',
            dataIndex: 'unidadesDespachadas',
            key: 'unidadesDespachadas',
        },
        {
            title: 'Observaciones',
            dataIndex: 'observaciones',
            key: 'observaciones'
        },
        {
            title: 'Fecha de remisión',
            dataIndex: 'fecha',
            key: 'fechaRemision'
        }
        
    ]
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    return (
        <Table size='middle' scroll={{y: 500}} pagination={false} rowKey='id' columns={columns} dataSource={data} />
    )
}
export default ListaRemision;