import { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ListaContext } from '../../contexts/informacionGrafico';
import { Alert, Spinner } from 'react-bootstrap';

const HorizontalBarChart = () => {
    const { lista, loading, error } = useContext(ListaContext);
    const nombre_operario = lista.map(persona => `${persona.nombre_operario}  (${persona.eficiencia})`);
    const totalUnidadesProducidas = lista.map(persona => persona.total_unidades_producidas);
    const totalMetaEficiencia = lista.map(persona => persona.total_meta_eficiencia);
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
              size: 40,
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
    height: '900px',
    display: 'flex',
    justifyContent: 'center',
  };

  if (loading) {
    return (
      <div style={styles}>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles}>
        <Alert variant="danger">
          Error al cargar los datos: {error.message}
        </Alert>
      </div>
    );
  }
  return (
    <div style={styles}>
      <Bar data={data} options={options} plugins={[ChartDataLabels]}/>
    </div>
  );

};

export default HorizontalBarChart;
