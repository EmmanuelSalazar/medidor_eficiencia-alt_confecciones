import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarRegistroOperaciones';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  // RECIBIR DATOS DE LA API
  const { data, loading, error, fetchData } = useFetchData();
  //
  const [listaRegistro, setLista] = useState([]);
  // HOOK PARA REALIZAR Y ALMACENAR SOLICITUD
  const setListaRegistro = async (modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin) => {
    try {
      const nuevaLista = await fetchData(modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin);
      setLista([...nuevaLista]);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };

  useEffect(() => {
    setListaRegistro();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ listaRegistro, loading, error, setListaRegistro }}>
      {children}
    </ListaContext.Provider>
  );
};