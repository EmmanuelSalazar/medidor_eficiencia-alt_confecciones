import React from "react";
import { Table } from 'antd';
import useMostrarContadoresFinales from "../../hooks/mostrarContadoresFinales.hook";
const ListaContadoresFinales = () => {
    const { data, status, error, fetchData } = useMostrarContadoresFinales();
    const columns = [
        { title: 'ID', dataIndex: 'op_id', key: 'op_id' },
        { title: 'Operario', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Modulo', dataIndex: 'modulo', key: 'modulo' },
    ]

    // MANEJO DEL ESTADO DE LA SOLICITUD
    if (status === 'pending') {
        return <span>Cargando...</span>
      }
    
    if (status === 'error') {
        return <span>Ha ocurrido un error: {error.message}</span>
    }
    return (
        <Table columns={columns} dataSource={data} />
    )
}
export default ListaContadoresFinales;