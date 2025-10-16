export function reordenarArreglo(datos, valorPrincipal) {
    let resultado = [];
    const otrosValores = datos.filter((item) => item.value !== valorPrincipal);
    const valorPrincipalValidado = datos.find((item) => item.value === valorPrincipal);
    if(valorPrincipalValidado) {
        resultado.push(valorPrincipalValidado);
        resultado = resultado.concat(otrosValores);
    } else {
        resultado = datos;
    }
    return resultado;
}