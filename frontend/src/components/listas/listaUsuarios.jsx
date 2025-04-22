import { Table, Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import useMostrarContadoresFinales from "../../hooks/mostrarUsuarios.hook";
import { Button } from "react-bootstrap";
import EliminarUsuario from '../../services/api/delete/eliminarUsuario';
import useMostrarUsuarios from '../../hooks/mostrarUsuarios.hook';
const ListaUsuarios = () => {
    const { data, status, error } = useMostrarContadoresFinales();
    const { reload } = useMostrarUsuarios();
    const { data: RespuestaUsuarioEliminado, fetchData  } = EliminarUsuario();
    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await reload();
            console.log(RespuestaUsuarioEliminado); 
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }

    }
    const columns = [
        { title: 'ID', dataIndex: 'user_id', key: 'user_id', width: 50 },
        { title: 'Nombre de usuario', dataIndex: 'nombre', key: 'nombre', width: 155 },
        { title: 'Rol', dataIndex: 'rol', key: 'rol', width: 135 },
        { title: 'Acciones', key: 'acciones', render: (text, record) => (
            <span>
            <Button variant="danger" onClick={() => handleDelete(record.user_id)}>
                Eliminar
            </Button>
        </span>     
        ), width: 160}
    ]

    // MANEJO DEL ESTADO DE LA SOLICITUD
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    return (
        <Table scroll={{y: 345}} rowKey="user_id" columns={columns} dataSource={data} pagination={false} />
    )
}
export default ListaUsuarios;