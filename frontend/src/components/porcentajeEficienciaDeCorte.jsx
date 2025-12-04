import React, { useState, useEffect } from "react";
import { ListaContext } from "../contexts/informacionGrafico";
import { useSearchParams } from "react-router-dom";
import FechaActual from "./fechaActual";
import { Spin } from 'antd';
const PorcentajeDeEficienciaPorCorte = () => {
    // CONTEXTOS
    const { eficiencia } = React.useContext(ListaContext);
    const [porcentaje, setPorcentaje] = useState("--");
    const [cargando, setCargando] = useState(false);
    // ACTUALIZAR AL RECIBIR NUEVOS DATOS
    useEffect(() => {

        if (eficiencia[0]) {
                setCargando(true)
                setPorcentaje(parseFloat(eficiencia[0].eficienciaQuincenal))
                setCargando(false)            
        } else {
                  setCargando(true)
                setPorcentaje('--')
                setCargando(false)
        }

    }, [eficiencia])
        
    //DAR COLOR AL RECUADRO SEGUN EFICIENCIA
    const obtenerColorEficiencia = () => {
        if (porcentaje > 69.9) {
            return 'bg-success text-light'
            } else if (porcentaje == 69) {
                return 'bg-success text-white' 
            } else if(porcentaje == "--") {
                return 'bg-warning  text-danger'
            } else {
                return 'bg-danger  text-light'
            }
        }
        /* -------------------- */
        if (cargando) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    return (
        <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
    )

}
export default PorcentajeDeEficienciaPorCorte