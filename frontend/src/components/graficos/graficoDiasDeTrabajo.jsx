import { Pie } from "react-chartjs-2";
const GraficoDiasDeTrabajo = ({ info }) => {
    let produccionTotal = info[0][0].produccionTotal;
    let produccionHecha = info[0][0].produccionHecha;
  const datos = {
    labels: ["Producción total", "Producción restante"],
    datasets: [
      {
        label: "Producción",
        data: [produccionTotal, produccionHecha],
        backgroundColor: ["#2077B4", "#FFC300"]
      },
    ]
  }
  const opciones = {
    plugins: {
      legend: {
        display: false
      }
    }
  }
  return (
    <Pie data={datos} options={opciones}/>
  )
}
export default GraficoDiasDeTrabajo;