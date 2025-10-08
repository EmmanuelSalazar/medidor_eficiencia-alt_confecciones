import React from "react";
import { ListaContext } from '../contexts/informacionGrafico';
import { Stack } from 'react-bootstrap'
const IncentivoQuincena = () => {
    const { eficiencia = [{}] } = React.useContext(ListaContext);
    const [beneficio, setBeneficio] = React.useState("--");
    const [porcentaje, setPorcentaje] = React.useState();
    const [porcentajeEstatico, setPorcentajeEstatico] = React.useState("--");
    // ACTUALIZAR COMPONENTES
    React.useEffect( () => {
       setPorcentaje(parseFloat(eficiencia?.[0]?.eficienciaQuincenal));
    }, [eficiencia]);
    React.useEffect(() => {
        establecerBeneficio();
    }, [porcentaje]);
    
    // ESTABLECER BENEFICIO GENERAL
    const establecerBeneficio = () => {
        if (porcentaje <= 69.9) {
            setPorcentajeEstatico("LOGRARLO");
            setBeneficio("PUEDES");
        } else if (porcentaje >= 70 && porcentaje <= 74.9) {
            setPorcentajeEstatico("70%")
            setBeneficio("$100.000");
        } else if (porcentaje >= 75 && porcentaje <= 79.9) {
            setPorcentajeEstatico("75%")
            setBeneficio("$150.000");
        } else if (porcentaje >= 80 && porcentaje <= 84.9) {
            setPorcentajeEstatico("80%")
            setBeneficio("$200.000");
        } else if (porcentaje >= 85 && porcentaje <= 89.9) {
            setPorcentajeEstatico("85%")
            setBeneficio("$250.000");
        } else if (porcentaje >= 90 && porcentaje <= 94.5) {
            setPorcentajeEstatico("90%")
            setBeneficio("$300.000");
        } else if (porcentaje >= 95) {
            setPorcentajeEstatico("100%")
            setBeneficio("$400.000");
        } else {
            setPorcentajeEstatico("--")
        }
    }
    /* ESTA FUNCION ESTÁ EN DESUSO POR REFACTORIZACIÓN
        //OBTENER EFICIENCIA PARA ESTABLECER BENEFICIO
    const establecerEficiencia = () => {
        // OBTENER REGISTRO CONTADOR
        const registroCalculador = listaRegistroQuincenal.filter((registro) => registro.modulo === modulo && registro.rol === 1)
    // CALCULAR EL TOTAL PRODUCIDO
        let totalProducido = registroCalculador.map(item => item.unidadesProducidas || 0);
        totalProducido = totalProducido.reduce((a,b) => a + b, 0);
    // CALCULAR EL TOTAL DE LA META
        let totalMeta = registroCalculador.map(item => item.metaDecimal || 0);
        totalMeta = totalMeta.reduce((a,b) => a + b, 2);
    // RETORNAR EFICIENCIA
        const eficienciaCalculada = ((totalProducido / totalMeta) * 100).toFixed(1);
    // ESTABLECER EFICIENCIA
        setPorcentaje(parseFloat(eficienciaCalculada));
    } */
    const PanelCompleto = () => {
        return (<Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <div className="p-2"><h4><strong>BENEFICIO</strong></h4></div>
                  <Stack direction="horizontal" gap={2} className="mb-2 d-flex justify-content-center">
                    <div className={`p-2 rounded bg-dark numeroConPorcentaje`}><strong className="beneficios">{beneficio}</strong></div>
                    <div className={`p-2 rounded bg-dark numeroConPorcentaje`}><strong className="beneficios">{porcentajeEstatico}</strong></div>
                  </Stack>
                  
        </Stack>)
    }
    return { beneficio, porcentajeEstatico, PanelCompleto }

}
export default IncentivoQuincena;