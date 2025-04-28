import { createContext, useState } from 'react'
export const PlantillaDespachoContext = createContext()

export const PlantillaDespachoProvider = ({ children }) => {
    const [cliente, setCliente] = useState()
    const [observaciones, setObservaciones] = useState()
    const [odp, setOdp] = useState([])
    const [unidades, setUnidades] = useState([])

    return (
        <PlantillaDespachoContext.Provider value={{ cliente, setCliente, odp, setOdp, unidades, setUnidades, observaciones, setObservaciones }}>
            {children}
        </PlantillaDespachoContext.Provider>
    )
}