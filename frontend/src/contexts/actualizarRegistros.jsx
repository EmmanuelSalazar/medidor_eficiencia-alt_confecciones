import { createContext, useState, useEffect } from 'react';
import useMostrarHorarios from '../hooks/mostrarHorarios.hook';
import FechaActual from '../components/fechaActual';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  // COMPONENTE DE FECHA
  const { fechaActualDia } = FechaActual();
  //
  const [lista, setLista] = useState([]);
  const [modulo, setModulo] = useState(0);
  const [fecha, setFecha] = useState(fechaActualDia);
    // ESTE ES EL  HOOK QUE TRAE LOS DATOS DE LA API
  const { data, status, error, reload } = useMostrarHorarios(fecha);
  // ACTUALIZAR DATOS CON LA FECHA
  useEffect(() => {
   actualizarRegistros();
  }, [fecha]);
  // DISTRIBUIR LOS DATOS POR MODULOS O TODOS LOS MODULOS EN CASO DE QUE SEA 0 EN EL MODULO
  useEffect(() => {
    if (data) {
      if (modulo === 0) {
        setLista(data.sort((a, b) => a.posicion - b.posicion));
      } else {
        setLista(data.filter((item) => item.modulo === modulo).sort((a, b) => a.posicion - b.posicion));
         }
    }
  }, [data, modulo]);

  const actualizarRegistros = async () => {
    try {
      await reload();
    } catch (error) {
      console.log(error);
    }
  } 
  return (
    <ListaContext.Provider value={{ lista, error , setModulo, setFecha }}>
      {children}
    </ListaContext.Provider>
  );
};