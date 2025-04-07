import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
const EstadisticaMensual = () => {
    const [data, setData] = useState([31,30,56,78,56,75])

    const datos = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], // Etiquetas del eje X
        datasets: [{
            label: 'Modulos', // Título de la línea
            data: data, // Valores del eje Y
            fill: false, // No rellenar el área bajo la línea
            borderColor: 'rgb(75, 192, 192)', // Color de la línea
            tension: 0.1 // Suavidad de la curva
        }]
    };
    const agregarDato = () => {
        setData([...data, Math.floor(Math.random() * 100)]);
        console.log(data); // Agregar un dato aleatorio
    };
    const options = {
        indexAxis: 'y',
        scales: {
            /* y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            } */
        }
    }
    return (
        <div className="grafico">
            <Line data={datos} />
            <button onClick={agregarDato}>Agregar Dato</button>
        </div>
    )
}
export default EstadisticaMensual