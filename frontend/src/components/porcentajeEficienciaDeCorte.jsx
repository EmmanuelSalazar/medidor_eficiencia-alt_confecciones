import React, { useState, useEffect } from "react";
import { Stack } from 'react-bootstrap'
import data from '../utils/json/cortePorQuincena.json'
import { ListaContext } from "../contexts/informacionGrafico";

const PorcentajeDeEficienciaPorCorte = () => {
    // CONTEXTOS
    const { lista } = React.useContext(ListaContext);
    //
    const [porcentaje, setPorcentaje] = useState("--");
    var corteQuincena = "";
    // ACTUALIZAR AL RECIBIR NUEVOS DATOS
    useEffect(() => {
            establecerEficiencia();
        }, [lista]);
    // ESTABLECER EFICIENCIA DEL MODULO
    const operarioCalculador = lista.find(operario => operario.calculador_final === 1);
    const establecerEficiencia = () => {
        if (operarioCalculador) {
            const eficienciaCalculada = operarioCalculador.eficiencia_quincenal;
            setPorcentaje(eficienciaCalculada);

        }
    }
    //DAR COLOR AL RECUADRO SEGUN EFICIENCIA
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
        /* CALCULAR CORTE */
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth()+1;
        const diaActual = fechaActual.getDate();
        const corte = data.find(corte => corte.mes == mesActual);
            if (diaActual <= 15) {
                corteQuincena = corte.primerCorte;
            } else {
                corteQuincena = corte.segundoCorte;
            }
        /* -------------------- */
    return (
                  <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
    )

}
export default PorcentajeDeEficienciaPorCorte