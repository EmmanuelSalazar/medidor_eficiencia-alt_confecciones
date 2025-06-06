import { createContext, useState, useEffect } from 'react';
import useMostrarRegistroOperaciones from '../hooks/mostrarRegistroOperaciones.hook';
import FechaActual from '../components/fechaActual';
import { useLocation } from 'react-router-dom';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const location = useLocation();
  const { fechaActualDia } = FechaActual();
  const [modulo, setModulo] = useState(0);
  const [lista, setLista] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(fechaActualDia);
  const [fechaFin, setFechaFin] = useState(fechaActualDia);
  // RECIBIR DATOS DEL HOOK
  const { data, status, error, reload } = useMostrarRegistroOperaciones(modulo, fechaInicio, fechaFin);
  // RECARGAR DATOS
  const actualizarLista = async () => {
    try {
      await reload();
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };
  // RESETEAR FILTROS AL ENTRAR EN "REGISTRAR OPERACIONES"
  useEffect(() => {
    if(location.pathname === '/registro_operaciones') {
      setModulo(0);
      setFechaInicio(fechaActualDia);
      setFechaFin(fechaActualDia);
    }
  }, [location]);
  // ACTUALIZAR DATOS AL ESTABLECER LAS FECHAS
  useEffect(() => {
      actualizarLista();
  }, [fechaInicio, fechaFin]);
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
    <ListaContext.Provider value={{ status, error, actualizarLista, setModulo, lista, setFechaInicio, setFechaFin }}>
      {children}
    </ListaContext.Provider>
  );
};