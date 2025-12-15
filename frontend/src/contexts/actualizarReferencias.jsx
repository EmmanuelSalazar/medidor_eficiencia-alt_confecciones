import { createContext, useState, useEffect } from 'react';
import useMostrarReferencias from '../hooks/mostrarReferencias.hook';
import { useLocation } from 'react-router-dom';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
 const { data, status, error, reload } = useMostrarReferencias();
 const location = useLocation();
  // VOLVER A CARGAR TODOS LOS OPERARIOS
  const [lista, setLista] = useState([]);
  const [modulo, setModulo] = useState(0);
  const [estado, setEstado] = useState(1);
   // MOSTRAR TODAS LAS REFERENCIAS AL ENTRAR EN LA PESTAÑA DE REFERENCIAS
   useEffect(() => {
      if(location.pathname === '/referencias' || location.pathname === '/bodega') {
          if(data) {
              setEstado(0)
          }
      }
  }, [location]);
  
  useEffect(() => {
    if(location.pathname === '/bodega') {
      alCargarBodega();
    }
  }, []);
    const alCargarBodega = () => {
      return setEstado(0);
    }
  // FILTRAR LAS REFERENCIAS
  useEffect(() => {
    if(data) {
        setLista(data);
    }
  }, [data])
  // ACTUALIZAR LA LISTA DE REFERENCIAS
  const actualizarLista = async () => {
    try {
      await reload();
    } catch (error) {
      console.error('Error al actualizar la lista:', error);
      throw error;
    }
  };
  return (
    <ListaContext.Provider value={{ status, error, lista, setLista, modulo, setModulo, actualizarLista }}>
      {children}
    </ListaContext.Provider>
  );
};