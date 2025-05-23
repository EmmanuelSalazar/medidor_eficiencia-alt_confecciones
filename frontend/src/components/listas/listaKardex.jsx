import { useContext, useState, useEffect } from "react";
import { Table, Spin } from 'antd'
import { Button, Stack, Alert } from'react-bootstrap';

const ListaKardex = ({ datos = [{}] }) => {
    const columns = [
        { title: 'Orden', dataIndex: 'orden', key: 'orden'},
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia'},
        { title: 'Color', dataIndex:'color', key:'color'},
        { title: 'Talla', dataIndex:'talla', key:'talla'},
        { title: 'Detalle', dataIndex:'detalle', key:'detalle'},
        { title: 'Color', dataIndex:'color', key:'color'},
        { title: 'Cantidad Recibida', dataIndex:'cantidad_recibida', key:'cantidad_recibida'},
        { title: 'Cantidad Entregada', dataIndex:'cantidad_entregada', key:'cantidad_entregada'},
        { title: 'Cantidad Pendiente', dataIndex:'cantidad_restante', key:'cantidad_pendiente'},
        { title: 'Fecha de entrada', dataIndex:'fecha', key:'fecha'},
        { title: 'Vejez', dataIndex:'vejez', key:'vejez'}
    ]

    return (
        <div>
            <Table columns={columns} dataSource={datos} />
        </div>
    )
}
export default ListaKardex;