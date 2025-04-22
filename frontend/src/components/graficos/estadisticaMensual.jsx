import { Line } from 'react-chartjs-2';
import { Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import 'chart.js/auto';
import moment from 'moment';
import useFetchData from '../../services/api/read/mostrarRendimientoHistorico';
const EstadisticaMensual = () => {
    // RECIBIR DATOS DE LA API
    const { data, loading, error } = useFetchData(1);
    // FILTRAR LOS REGISTROS POR MODULO
    const infoModulo1 = data.filter((item) => item.modulo === 1).map((item) => item.TotalUnidadesProducidas);
    const infoModulo2 = data.filter((item) => item.modulo === 2).map((item) => item.TotalUnidadesProducidas);
    const infoModulo3 = data.filter((item) => item.modulo === 3).map((item) => item.TotalUnidadesProducidas);    // MAPEO DE LOS DIAS DEL MES
    const dias = () => {
        let dias = [];
        for (let i = 0; i <= 30; i++) {
            const fechaHaceUnMes = moment().subtract((30-i), 'days').format('MM-DD');
            dias.push(fechaHaceUnMes);
        }
        return dias;
    }
    const datos = {
        labels: dias(), // Etiquetas del eje X
        datasets: [{
            label: 'Modulo 1', // Título de la línea
            data: infoModulo1, // Valores del eje Y
            fill: false, // No rellenar el área bajo la línea
            borderColor: 'rgb(75, 192, 192)', // Color de la línea
            tension: 0.1 // Suavidad de la curva
        },
        {
            label: 'Modulo 2', 
            data: infoModulo2, 
            fill: false, 
            borderColor: 'rgb(255, 99, 132)', 
            tension: 0.1 
        },
        {
            label: 'Modulo 3', 
            data: infoModulo3, 
            fill: false, 
            borderColor: 'rgb(255, 227, 69)', 
            tension: 0.1
        }
    ]
    };
    if (loading) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    if (error) return <Alert variant='danger'>Error: {error.message}</Alert>;
    return (
        <div className="grafico">
            <Line data={datos} />
        </div>
    )
}
export default EstadisticaMensual