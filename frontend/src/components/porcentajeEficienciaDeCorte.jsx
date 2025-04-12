import React, { useState, useEffect } from "react";
import { ListaContext } from "../contexts/informacionGrafico";
import { useSearchParams } from "react-router-dom";
import FechaActual from "./fechaActual";
import { Spin } from 'antd';
const PorcentajeDeEficienciaPorCorte = () => {
    const {corteQuincenaFormateado, anioActual} = FechaActual();
    let corteQuincena = `${anioActual}-${corteQuincenaFormateado[0].fechaInicial}`;
    // CONTEXTOS
    const { lista, listaRegistroQuincenal, actualizarListaRegistro } = React.useContext(ListaContext);    //OBTENER MODULO
    const [buscarParametro] = useSearchParams();
    let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
    const [porcentaje, setPorcentaje] = useState("--");
    const [cargando, setCargando] = useState(false);
    const modulo = moduloEnLaUrl || window.ModuloSeleccionado;
    // ACTUALIZAR AL RECIBIR NUEVOS DATOS
    useEffect(() => {
            const actualizarRegistros = async () => {
                setCargando(true);
                try {
                    await actualizarListaRegistro(modulo, corteQuincena, null, null, null, 1, 1);
                } catch (error) {
                    console.log('Error: ', error)
                } finally {
                    establecerEficiencia();
                    setCargando(false);
                }
            }
        actualizarRegistros();
        }, [lista]);
         
            const establecerEficiencia = () => {
                // OBTENER REGISTRO CONTADOR
                const registroCalculador = listaRegistroQuincenal.filter((registro) => registro.modulo === modulo && registro.rol === 1)
            // CALCULAR EL TOTAL PRODUCIDO
                let totalProducido = registroCalculador.map(item => item.unidadesProducidas || 0);
                totalProducido = totalProducido.reduce((a,b) => a + b, 0);
            // CALCULAR EL TOTAL DE LA META
                let totalMeta = registroCalculador.map(item => item.metaDecimal || 0);
                totalMeta = totalMeta.reduce((a,b) => a + b, 0);
            // RETORNAR EFICIENCIA
                const eficienciaCalculada = ((totalProducido / totalMeta) * 100).toFixed(1);
            // ESTABLECER EFICIENCIA
                setPorcentaje(parseFloat(eficienciaCalculada));
            }
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