import React from "react";
import { Table, Spin } from "antd";
import { Alert } from "react-bootstrap";
import useRegistroOperacionesResumido from "../../hooks/mostrarRegistroOperacionesResumido.hook";
import FechaActual from "../fechaActual";
const ListaRegistroOperacionesResumido = ({ modulo, fechaInicio, fechaFin, datos = [{}] }) => {
    const { obtenerCortes } = FechaActual();
    const cortes = obtenerCortes();
    const fechaInicioSeleccionada = fechaInicio || cortes.fechaInicio;
    const fechaFinSeleccionada = fechaFin || cortes.fechaFinal;

    const columns = [
        { title: 'Nombre', dataIndex: 'NombreOperario', key: 'nombre', width: 300 },
        { title: 'Total UND', dataIndex: 'TotalUnidadesProducidas', key: 'totalUnidades', width: 165},
        { title: 'Meta', dataIndex: 'TotalMeta', key: 'totalMeta', width: 120 },
                { title: 'Eficiencia en und', dataIndex: 'Eficiencia', key: 'eficiencia', width: 100,
            render: (text, record) => record.Eficiencia + '%'
         },
        { title: 'Eficiencia promedio', dataIndex: 'PromedioEficiencia', key: 'eficienciaPromedio', width: 100, 
            render: (text, record) => record.PromedioEficiencia + '%'
         },
        { title: 'Modulo 1', dataIndex: 'modulo_1', key: 'modulo1', width: 100 },
        { title: 'Modulo 2', dataIndex: 'modulo_2', key: 'modulo2', width: 100 },
        { title: 'Modulo 3', dataIndex: 'modulo_3', key: 'modulo3', width: 100 },
        { title: 'Modulo 4', dataIndex:'modulo_4', key:'modulo4', width: 100 },
    ]
    
    return (
        <Table columns={columns} dataSource={datos} pagination={false} size="small" />
    )
}
export default ListaRegistroOperacionesResumido;