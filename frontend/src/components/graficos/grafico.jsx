import { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Alert, Spinner } from 'react-bootstrap';

const HorizontalBarChart = ( { operatorData = [{}], incentiveData = [{}], graphicHeight = '500px', verticalFontHeight = 40 }) => {
    const nombre_operario = operatorData.map(persona => `${persona.operario}  (${persona.EficienciaDelDia}%)`);
    const totalUnidadesProducidas = operatorData.map(persona => persona.TotalProducido);
    const totalMetaEficiencia = operatorData.map(persona => persona.TotalMeta);
    const calcularValorMaximo = Math.max(
      ...totalUnidadesProducidas,
      ...totalMetaEficiencia
    )
    const valorMaximo = calcularValorMaximo + 50;
  const data = {
    labels: nombre_operario,
    datasets: [
      {
        label: ['Meta'],
        data: totalMetaEficiencia,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'rgba(137,243,54)'
      },
      {
        label: 'Progreso',
        data: totalUnidadesProducidas,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#0000ff'
      },
      
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
        y: {
          ticks: {
            font: {
              size: verticalFontHeight,
              weight: 'bold'
            },
            color: 'white',
          },
        },
        x: {
          max: valorMaximo,
          ticks: {
            font: {
              size: 20,
              weight: 'bold'
            },
            color: 'white'
          },
        }
  },
  plugins: {
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'end',
      color: 'white',
      font: {
          size: 28,
          weight: 'bold',
      },
      formatter: (value) => `${value}`,
    },
    legend: {
      labels: {
        font: {
          size: 20,
          weight: 'bold'
        },
        color: 'white'
      },
    },
  },
};

  const styles = {
    width: '1320px',
    height: graphicHeight,
    display: 'flex',
    justifyContent: 'center',
  };


  return (
    <div style={styles}>
      <Bar data={data} options={options} plugins={[ChartDataLabels]}/>
    </div>
  );

};

export default HorizontalBarChart;