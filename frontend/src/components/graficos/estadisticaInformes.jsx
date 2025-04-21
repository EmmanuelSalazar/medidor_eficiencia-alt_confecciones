import { Bar } from 'react-chartjs-2';
import { Spin } from 'antd';
import { Alert } from 'react-bootstrap';
import 'chart.js/auto';
import useRegistroOperacionesResumido from "../../hooks/mostrarRegistroOperacionesResumido.hook";
import { HeartFilled } from '@ant-design/icons';
const EstadisticaInforme = ({ modulo }) => {
    // RECIBIR DATOS DE LA API
    const { data, status, error } = useRegistroOperacionesResumido(modulo);
    if (!data) {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    }
    // INFORMACION PARA LA GRAFICA
     const NombreOperarios = data.map((item) => item.NombreOperario);
    const infoModuloProducido = data.map((item) => item.TotalUnidadesProducidas);
    const infoModuloMeta = data.map((item) => item.TotalMeta);
    const datos = {
        labels: NombreOperarios,
        datasets: [
            {
                label: 'Total unidades producidas',
                data: infoModuloProducido,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Total meta',
                data: infoModuloMeta,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',  
            }
        ]
    }
    const options = {
        indexAxis: "y",
        plugins: {
            legend: {
                display: true,
                position: "top"
            },
            title: {
                display: true,
                text: "Información visualizada"
            }
        },
        scales: {
            x: {
                stacked: false // Barras agrupadas (no apiladas)
            },
            y: {
                beginAtZero: true
            }
        }
    };
    const styles = {
        width: '100%',
        maxWidth: '100%',
        heigth : '100%',
        maxHeigth: '100%'
    }
    if (status === 'pending') {
        return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>
      }
    
    if (status === 'error') {
        return <Alert variant='danger'>Error: {error.message}</Alert>;
    }
    return (
        <div style={styles} className="d-flex justify-content-center graficoInformes">
            <Bar data={datos} options={options} />
         </div>
        )
}
export default EstadisticaInforme