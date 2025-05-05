import { createContext, useState } from 'react'
export const PlantillaDespachoContext = createContext()

export const PlantillaDespachoProvider = ({ children }) => {
    const [cliente, setCliente] = useState()
    const [observaciones, setObservaciones] = useState()
    const [odp, setOdp] = useState([])
    const [unidades, setUnidades] = useState([])
    const [despachos, setDespachos] = useState([{
        id: Date.now(),
        odp_id: 0,
        unidadesDespachadas: 0,
        informacionODP: null
    }])
    return (
        <PlantillaDespachoContext.Provider value={{ cliente, setCliente, odp, setOdp, unidades, setUnidades, observaciones, setObservaciones, despachos, setDespachos }}>
            {children}
        </PlantillaDespachoContext.Provider>
    )
}