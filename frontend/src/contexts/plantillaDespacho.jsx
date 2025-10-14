import { createContext, useState } from 'react'
export const PlantillaDespachoContext = createContext()

export const PlantillaDespachoProvider = ({ children }) => {
    const [cargando, setCargando] = useState(false);
    const [cliente, setCliente] = useState()
    const [observaciones, setObservaciones] = useState()
    const [odp, setOdp] = useState([])
    const [fecha, setFecha] = useState()
    const [unidades, setUnidades] = useState([])
    const [sumatoriaUnidades, setSumatoriaUnidades] = useState();
    const [primerasConSegundas, setPrimerasConSegundas] = useState();
    const [numeroRemision, setNumeroRemision] = useState();
    const [despachos, setDespachos] = useState([{
        id: Date.now(),
        odp_id: 0,
        unidadesDespachadas: 0,
        informacionODP: null,
        bajas: 0,
        sumatoria: 0,
        estado: 0,
        unidadesBajas: 0
    }])
    return (
        <PlantillaDespachoContext.Provider value={{ cliente, setCliente, odp, setOdp, unidades, setUnidades, observaciones, setObservaciones, despachos, setDespachos, fecha, setFecha, sumatoriaUnidades, setSumatoriaUnidades, primerasConSegundas, setPrimerasConSegundas, numeroRemision, setNumeroRemision, cargando, setCargando }}>
            {children}
        </PlantillaDespachoContext.Provider>
    )
}