import { Table, Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import useMostrarClientes from '../../hooks/mostrarClientes.hook';
const ListaClientes = () => {
const { data, status, error } = useMostrarClientes();  
 const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre'},
    { title: 'Telefono', dataIndex: 'telefono', key: 'telefono'},
    { title: 'Direccion', dataIndex: 'direccion', key: 'direccion'},
    { title: 'Ciudad', dataIndex: 'ciudad', key: 'ciudad'},
    {title: 'NIT', dataIndex: 'nit', key: 'nit'},
];
if (status === 'pending') {
    return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
  }

if (status === 'error') {
    return <Alert variant='danger'>Error: {error.message}</Alert>;
}
return (
    <Table rowKey='client_id' columns={columns} dataSource={data} />
)
}
export default ListaClientes