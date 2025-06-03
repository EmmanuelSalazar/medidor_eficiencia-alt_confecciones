import { useContext } from "react";

import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import { ListaContext } from '../../contexts/informacionGrafico';

const GraficaAdministrativa = () => {
    const { listaOperarios } = useContext(ListaContext);
    const nombre_operario = listaOperarios.map(persona => `${persona.operario}  (${persona.EficienciaDelDia}%)`);
    const totalUnidadesProducidas = listaOperarios.map(persona => persona.TotalProducido);
    const totalMetaEficiencia = listaOperarios.map(persona => persona.TotalMeta);
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
        indexAxis: 'y',
        scales: {
            y: {
              ticks: {
                font: {
                  size: 16,
                  weight: 'bold'
                },
                color: 'black',
              },
            },
            x: {
              ticks: {
                font: {
                  size: 16,
                  weight: 'bold'
                },
                color: 'black'
              },
            }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'black'
          },
        },
      },
    };
    
      const styles = {
        maxWidth: '1280px',
        display: 'flex',
        justifyContent: 'center',
      };
      return (
        <div style={styles}>
          <Bar data={data} options={options}/>
        </div>
      );
}
export default GraficaAdministrativa;