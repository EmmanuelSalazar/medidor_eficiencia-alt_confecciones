
import { Table } from 'antd';

const ListaSumatoriaReferencia = ( { data = [{}] }) => {
    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia', width: 100 },
        { title: 'Unidades Producidas', dataIndex: 'unidades', key: 'unidades', width: 110 },

    ]
    return (
        <div className="limitToPrint">
            <Table  rowKey="referencia" columns={columns} dataSource={data} pagination={false} />
        </div>
    )
}
export default ListaSumatoriaReferencia;
