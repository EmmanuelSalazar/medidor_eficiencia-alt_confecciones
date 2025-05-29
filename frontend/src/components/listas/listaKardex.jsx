import { useContext, useState, useEffect } from "react";
import { Table, Spin } from 'antd'
import { Button, Stack, Alert } from'react-bootstrap';

const ListaKardex = ({ datos = [{}] }) => {
    datos = datos.filter((item) => item.cantidad_restante > 0);
    const columns = [
        { title: 'Orden', dataIndex: 'orden', key: 'orden', width: 100},
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia', width: 100},
        { title: 'Color', dataIndex:'color', key:'color', width: 90},
        { title: 'Talla', dataIndex:'talla', key:'talla', width: 70},
        { title: 'Detalle', dataIndex:'detalle', key:'detalle', width: 80},
        { title: 'Cantidad Recibida', dataIndex:'cantidad_recibida', key:'cantidad_recibida', width: 100},
        { title: 'Cantidad Entregada', dataIndex:'cantidad_entregada', key:'cantidad_entregada', width: 100},
        { title: 'Cantidad Pendiente', dataIndex:'cantidad_restante', key:'cantidad_pendiente', width: 100},
        { title: 'Fecha de entrada', dataIndex:'fecha', key:'fecha', width: 100},
        { title: 'Vejez', dataIndex:'vejez', key:'vejez', width: 62}
    ]

    return (
        <div className="limitToPrint">
            <Table size="small" columns={columns} dataSource={datos} pagination={false} />
        </div>
    )
}
export default ListaKardex;