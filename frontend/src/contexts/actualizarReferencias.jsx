import { createContext, useState, useEffect } from 'react';
import useMostrarReferencias from '../hooks/mostrarReferencias.hook';
import { useLocation } from 'react-router-dom';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
 const { data, status, error, reload } = useMostrarReferencias();
 const location = useLocation();
 
  // VOLVER A CARGAR TODOS LOS OPERARIOS
  const [lista, setLista] = useState([]);
  const [modulo, setModulo] = useState(5);
  const [estado, setEstado] = useState(1);
   // MOSTRAR TODAS LAS REFERENCIAS AL ENTRAR EN LA PESTAÑA DE REFERENCIAS
   useEffect(() => {
      if(location.pathname === '/referencias' || location.pathname === '/bodega') {
          if(data) {
              setEstado(0)
          }
      }
  }, [location]);
  // FILTRAR LAS REFERENCIAS
  useEffect(() => {
    if(data) {
        // Si el modulo es 0, mostrar todas las referencias, si no, mostrar solo las referencias del modulo seleccio
        if(modulo === 0) {
            setLista(data.sort((a, b) => a.modulo - b.modulo))
        } else {
           if(estado === 0) {
            setLista(data.filter((lista) => lista.modulo === modulo));
           } else {
            setLista(data.filter((lista) => lista.modulo === modulo && lista.estado === 'Activo'));
           }
        }
    }
  }, [modulo, estado, data])
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