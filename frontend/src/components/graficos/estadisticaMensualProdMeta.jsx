import React from "react";
import { Line } from 'react-chartjs-2';
import { Spin } from 'antd';
import { Alert, Stack } from 'react-bootstrap';
import { Statistic } from "antd";
import CountUp from 'react-countup';
import 'chart.js/auto';
import moment from 'moment';
import useFetchData from '../../services/api/read/mostrarRendimientoHistorico';
const formatter = value => <CountUp end={value} separator="," />;
const EstadisticaMensualProdMeta = ({ modulo, total }) => {
    // RECIBIR DATOS DE LA API
    const { data, loading, error } = useFetchData(1);
    const infoModuloProducido = data.filter((item) => item.modulo === modulo).map((item) => item.TotalUnidadesProducidas);
    const infoModuloMeta = data.filter((item) => item.modulo === modulo).map((item) => item.TotalMetaUnidades);
    const infoModuloProducidoTotal = infoModuloProducido.reduce((a, b) => a + b, 0);
    const infoModuloMetaTotal = infoModuloMeta.reduce((a, b) => a + b, 0);
     const dias = () => {
            let dias = [];
            for (let i = 0; i <= 30; i++) {
                const fechaHaceUnMes = moment().subtract((30-i), 'days').format('MM-DD');
                dias.push(fechaHaceUnMes);
            }
            return dias;
        }
    const datos = {
        labels: dias(),
        datasets: [{
            label: `Unidades producidas`, // Título de la línea
            data: infoModuloProducido, // Valores del eje Y
            fill: false, // No rellenar el área bajo la línea
            borderColor: 'rgb(75, 192, 192)', // Color de la línea
            tension: 0.1 // Suavidad de la curva
        },{
            label: 'Meta', 
            data: infoModuloMeta, 
            fill: false, 
            borderColor: 'rgb(255, 99, 132)', 
            tension: 0.1 
        },]
    }

    if (loading) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    if (error) return <Alert variant='danger'>Error: {error.message}</Alert>;
    return (
        <div className="grafico">
            <Line data={datos} />
            {total === true && <Stack direction="horizontal" gap={5}>
                <Statistic formatter={formatter} title="Total unidades producidas" value={infoModuloProducidoTotal}/>
                <Statistic formatter={formatter} title="Total meta" value={infoModuloMetaTotal}/>
            </Stack>}
         </div>
        )
}
export default EstadisticaMensualProdMeta