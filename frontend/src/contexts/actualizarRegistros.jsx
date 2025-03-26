import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/read/mostrarIngresosPorHoras';
import FechaActual from '../components/fechaActual';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  // COMPONENTE DE FECHA
  const { fechaActualDia } = FechaActual();
  // RECIBIR DATOS DE LA API
  const { data, loading, error, fetchData } = useFetchData();
  //
  const [lista, setLista] = useState([]);
  // HOOK PARA REALIZAR Y ALMACENAR IFORMACION
  const listaActualizada = async (fecha, modulo) => {
    window.moduloConsultado = modulo;
    const fechaConsultada = fecha ?? fechaActualDia;
    try {
      const nuevaLista = await fetchData(fechaConsultada, modulo);
      setLista([...nuevaLista]);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };

  useEffect(() => {
    listaActualizada();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ lista, loading, error, listaActualizada }}>
      {children}
    </ListaContext.Provider>
  );
};