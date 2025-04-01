import React, { useEffect, useState } from "react";
import FechaActual from './fechaActual'
import { ListaContext } from "../contexts/informacionGrafico";
const PorcentajeDeEficienciaDiaria = () => {
    // CONTEXTOS
    const { lista } = React.useContext(ListaContext);
    // COMPONENTE DE FECHAS
    const { fechaFormateada } = FechaActual();
    //
    const [porcentaje, setPorcentaje] = useState("--");
    // ACTUALIZAR AL RECIBIR NUEVOS DATOS
    useEffect(() => {
        establecerEficiencia();
    }, [lista]);
    // Establecer el operario que calcula la eficiencia del modulo
    const operarioCalculador = lista.find(operario => operario.calculador_final === 1);
    const establecerEficiencia = () => {
        if (operarioCalculador) {
            const eficienciaCalculada = operarioCalculador.eficiencia_int;
            setPorcentaje(eficienciaCalculada);

        }
    }
    // DAR COLOR AL RECUADRO SEGUN EFICIENCIA
    const obtenerColorEficiencia = () => {
        if (porcentaje > 70) {
            return 'bg-success text-light'
            } else if (porcentaje == 69) {
                return 'bg-success text-white' 
            } else if(porcentaje == "--") {
                return 'bg-warning  text-danger'
            } else {
                return 'bg-danger  text-light'
            }
        }
    return (
            <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
    )
}
export default PorcentajeDeEficienciaDiaria