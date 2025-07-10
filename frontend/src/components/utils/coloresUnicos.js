export function coloresUnicos(datos = []) {
    const coloresUnicos = new Set();
    datos.forEach((dato) => {
        coloresUnicos.add(dato);
    })
    return Array.from(coloresUnicos);
}
export function detallesUnicos(datos = []) {
    const detallesUnicos = new Set();
    datos.forEach((dato) => {
        detallesUnicos.add(dato);
    })
    return Array.from(detallesUnicos);
}