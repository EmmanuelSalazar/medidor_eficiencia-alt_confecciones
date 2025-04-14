import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { ListaContext } from "../contexts/informacionGrafico";
import { useSearchParams } from "react-router-dom";
const PorcentajeDeEficienciaDiaria = () => {
    // CONTEXTOS
    const { lista, actualizarListaRegistro, listaRegistro } = React.useContext(ListaContext);
    // OBTENER MODULO CON URL
        const [buscarParametro] = useSearchParams();
        let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
    // 
    const modulo = moduloEnLaUrl || window.ModuloSeleccionado;
    const [porcentaje, setPorcentaje] = useState("--");
    const [cargando, setCargando] = useState(false);
    // ACTUALIZAR AL RECIBIR NUEVOS DATOS
    useEffect(() => {
        
        const actualizarRegistros = async () => {
            setCargando(true);
            try {
                await actualizarListaRegistro(modulo, window.fechaSeleccionada, window.fechaSeleccionada, null, null, 1, false);
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
            const registroCalculador = listaRegistro.filter((registro) => registro.modulo === modulo && registro.rol === 1)
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
    // DAR COLOR AL RECUADRO SEGUN EFICIENCIA
    const obtenerColorEficiencia = () => {
        if (porcentaje > 69.9) {
            return 'bg-success text-light'
            } else if(porcentaje == "--") {
                return 'bg-warning  text-danger'
            } else {
                return 'bg-danger  text-light'
            }
        }
    if (cargando) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    return (
            <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
    )
}
export default PorcentajeDeEficienciaDiaria