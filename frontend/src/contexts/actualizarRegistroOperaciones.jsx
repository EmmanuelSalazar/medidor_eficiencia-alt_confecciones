import { createContext, useState, useEffect } from 'react';
import useMostrarRegistroOperaciones from '../hooks/mostrarRegistroOperaciones.hook';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const [modulo, setModulo] = useState(0);
  const [lista, setLista] = useState([]);

  // RECIBIR DATOS DEL HOOK
  const { data, status, error, reload } = useMostrarRegistroOperaciones();
  // RECARGAR DATOS
  const actualizarLista = async () => {
    try {
      await reload();
      console.log('Datos actualizados');
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };
  useEffect(() => {
    if(data) {
      if(data.length === 0) {
        setLista([]);
      } else {
        if(modulo === 0) {
          setLista(data.sort((a, b) => a.modulo - b.modulo))
        } else {
          setLista(data.filter((lista) => lista.modulo === modulo));
        }
      }
    } else {
        setLista([]);
    }
  },[modulo, data])

  return (
    <ListaContext.Provider value={{ status, error, actualizarLista, setModulo, lista }}>
      {children}
    </ListaContext.Provider>
  );
};