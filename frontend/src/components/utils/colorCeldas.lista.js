export function colorPorReferencia(dato = '') {
    switch (dato) {
        /* REYMON */
                case '450':
                    return {
                    style: { background: '#4f8b89', color: 'white' }
                    }
                case '417':
                    return {
                    style: { background: '#62a07b', color: 'white' }
                    }
                case '417U':
                    return {
                    style: { background: '#62a07b', color: 'white' }
                    }
                case '453':
                    return {
                    style: { background: '#5c4f79', color: 'white' }
                    }
                case '420':
                    return {
                    style: { background: '#613860', color: 'white' }
                    } 
                case '419' :
                    return {
                    style: { background: '#536c8d', color: 'white' }
                    } 
                case '455':
                    return {
                    style: { background: '#906090', color: 'white' }
                    } 
                case '456':
                    return {
                    style: { background: '#457d97', color: 'white' }
                    }
        /* PRODICO Y LEONISA */
                case '71357':
                    return {
                    style: { background: '#f7f0ba' }
                    } 
                case '71330':
                    return {
                    style: { background: '#e0dba4' }
                    } 
                case '71332':
                    return {
                    style: { background: '#a9cba6', color: 'white' }
                    }
                case '71326':
                    return {
                    style: { background: '#7ebea3', color: 'white' }
                    } 
                case '71318':
                    return {
                    style: { background: '#53a08e', color: 'white' }
                    } 
                default:
                    break;
            }
}
export function colorPorRestante(inicial = '', restante = '') {
    const porcentaje = (restante * 100) / inicial
    if (porcentaje === 1) {
        return {
            style: { background: '#ff194b' }
        }
    } else if (porcentaje === 100) {
        return {
            style: { background: '#00a9d4', color: 'white' }
        }
    } else if (porcentaje <= 99 && porcentaje >= 80) {
        return {
            style: { background: '#8A2BE2' }
        }
    } else if (porcentaje <= 79 && porcentaje >= 50) {
        return {
            style: { background: '#4c2882' }
        }
    } else if (porcentaje <= 49 && porcentaje >= 26) {
        return {
            style: { background: '#4c2882', color: 'white'  }
        }
    } else if (porcentaje <= 25 && porcentaje >= 2) {
        return {
            style: { background: '#922b3e', color: 'white' } 
        }
    }else if(porcentaje <= 1.99 && porcentaje >= 1 || parseInt(restante) <= 10 && parseInt(restante) >= 1) {
        return {
            style: { background: '#FF3F33'} 
        }
    } else if (porcentaje === 0) {
        return {
            style: { background: '#AEEA94'} 
        }
    }
}