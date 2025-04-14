import React from "react";
import { Table, Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import useMostrarContadoresFinales from "../../hooks/mostrarUsuarios.hook";
import { Button } from "react-bootstrap";
const ListaUsuarios = () => {
    const { data, status, error } = useMostrarContadoresFinales();
    const columns = [
        { title: 'ID', dataIndex: 'user_id', key: 'user_id', width: 50 },
        { title: 'Nombre de usuario', dataIndex: 'nombre', key: 'nombre', width: 155 },
        { title: 'Rol', dataIndex: 'rol', key: 'rol', width: 135 },
        { title: 'Acciones', key: 'acciones', render: (text, record) => (
            <span>
            <Button variant="warning" className="m-1" onClick={() => showModal(record)}>
                Editar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(record.regProd_id)}>
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