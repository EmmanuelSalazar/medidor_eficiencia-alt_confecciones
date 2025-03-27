import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarReferencias';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  // RECIBIR DATOS DE LA API
  const { data, loading, error, fetchData } = useFetchData();
  //
  const [listas, setLista] = useState([]);
  // HOOK PARA REALIZAR Y ALMACENAR SOLICITUD
  const actualizarListas = async (modulo, redux) => {
    let moduloConsultado = modulo ?? null;
    let reduxConsultado = redux ?? 0;
    try {
      const nuevaLista = await fetchData(moduloConsultado, reduxConsultado);
      setLista([...nuevaLista]);
    } catch (error) {
      throw error;
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };

  useEffect(() => {
    actualizarListas();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ listas, loading, error, actualizarListas }}>
      {children}
    </ListaContext.Provider>
  );
};