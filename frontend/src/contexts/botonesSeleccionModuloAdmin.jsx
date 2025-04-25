import { createContext, useState } from "react";
export const ContextoModulo = createContext();

export const ModuloProvider = ({ children }) => {
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);

    return (
        <ContextoModulo.Provider value={{ moduloSeleccionado, setModuloSeleccionado }}>
            {children}
        </ContextoModulo.Provider>
    )
}