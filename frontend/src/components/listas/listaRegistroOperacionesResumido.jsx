import { Table, Spin } from "antd";
import { Alert } from "react-bootstrap";
import useRegistroOperacionesResumido from "../../hooks/mostrarRegistroOperacionesResumido.hook";
const ListaRegistroOperacionesResumido = ({ modulo }) => {
    const { data, status, error } = useRegistroOperacionesResumido(modulo);
    const columns = [
        { title: 'Nombre', dataIndex: 'NombreOperario', key: 'nombre', width: 300 },
        { title: 'Total UND', dataIndex: 'TotalUnidadesProducidas', key: 'totalUnidades', width: 165},
        { title: 'Meta', dataIndex: 'TotalMeta', key: 'totalMeta', width: 120 },
        { title: 'Eficiencia', dataIndex: 'PromedioEficiencia', key: 'eficiencia', width: 100 },
        { title: 'Modulo 1', dataIndex: 'modulo_1', key: 'modulo1', width: 100 },
        { title: 'Modulo 2', dataIndex: 'modulo_2', key: 'modulo2', width: 100 },
        { title: 'Modulo 3', dataIndex: 'modulo_3', key: 'modulo3', width: 100 },
        { title: 'Modulo 4', dataIndex:'modulo_4', key:'modulo4', width: 100 },
    ]
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    return (
        <Table columns={columns} dataSource={data} pagination={false} size="small" />
    )
}
export default ListaRegistroOperacionesResumido;