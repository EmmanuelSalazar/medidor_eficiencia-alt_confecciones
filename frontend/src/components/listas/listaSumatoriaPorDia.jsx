import { Table } from 'antd';
const ListaPorOperario = ( { data = [{}] }) => {

    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', width: 100 },
        { title: 'Operario', dataIndex: 'nombre', key: 'nombre', width: 155 },
        { title: 'Unidades Producidas', dataIndex: 'unidades_producidas', key: 'unidades_producidas', width: 110 },
        { title: 'Meta de unidades', dataIndex: 'unidades_por_producir', key: 'unidades_por_producir', width: 105 },
        { title: 'Eficiencia', dataIndex: 'eficiencia', key: 'eficiencia', width: 100, 
            render: (text, record) => record.eficiencia + '%'
         },
    ]

    return (
        <div className="limitToPrint">
            <Table  rowKey="user_id" columns={columns} dataSource={data} pagination={false} />
        </div>
    )
}
export default ListaPorOperario;
