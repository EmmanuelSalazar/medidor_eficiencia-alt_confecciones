import { useContext, useState, useEffect } from "react";
import { ListaContext } from "../../contexts/actualizarRegistroOperaciones";
const IncentivoQuincena = ({ modulo, fechaInicio, fechaFinal }) => {
    const { eficiencia } = useContext(ListaContext);
    console.log(eficiencia);
    const [beneficio, setBeneficio] = useState("--");
    const [porcentaje, setPorcentaje] = useState();
    const [porcentajeEstatico, setPorcentajeEstatico] = useState("--");
    // ACTUALIZAR COMPONENTES
    useEffect( () => {
        setPorcentaje(parseFloat(eficiencia?.[0]?.eficienciaQuincenal));
/*         console.log(eficiencia);
 */    }, [eficiencia]);
    
    useEffect(() => {
        establecerBeneficio();
/*         console.log(porcentaje);
 */    }, [porcentaje]);

    // ESTABLECER BENEFICIO GENERAL
    const establecerBeneficio = () => {
        if (porcentaje <= 69.9) {
            setPorcentajeEstatico("A");
            setBeneficio("N");
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
        console.log(porcentaje);
    }

    /* //OBTENER EFICIENCIA PARA ESTABLECER BENEFICIO // ESTA FUNCION ESTÁ EN DESUSO POR REFACTORIZACIÓN
    const establecerEficiencia = () => {
        // OBTENER REGISTRO CONTADOR
        const registroCalculador = listaRegistro.filter((registro) => registro.modulo === modulo && registro.rol === 1)
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

   return (
    <span>{beneficio} / {porcentajeEstatico}</span>
    )

}
export default IncentivoQuincena;