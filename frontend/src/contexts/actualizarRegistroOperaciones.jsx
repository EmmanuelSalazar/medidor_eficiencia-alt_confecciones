import { createContext, useState, useEffect } from 'react';
import useMostrarRegistroOperaciones from '../hooks/mostrarRegistroOperaciones.hook';
import FechaActual from '../components/fechaActual';
import { useLocation } from 'react-router-dom';
import useMostrarOrdenesDeProduccion from '../hooks/useCargarOrdenesDeProduccion';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  // CONTEXTOS
  const location = useLocation();
  const { fechaActualDia } = FechaActual();
  const [modulo, setModulo] = useState(0);
  const [ordenesDeProduccionModulo, setOrdenesDeProduccionModulo] = useState([]);
  const [lista, setLista] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(fechaActualDia);
  const [fechaFin, setFechaFin] = useState(fechaActualDia);
  const [total, setTotal] = useState();
  const [pagina, setPagina] = useState(1);
  // RECIBIR DATOS DEL HOOK
  const { data: ordenesDeProduccion, status: statusOrdenes, error: errorOrdenes, reload: reloadOrdenes } = useMostrarOrdenesDeProduccion();
  const { data, status, error, reload } = useMostrarRegistroOperaciones(modulo, fechaInicio, fechaFin, pagina);
  // RECARGAR DATOS
  const actualizarLista = async () => {
    try {
      await reload();
      await reloadOrdenes();
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
    actualizarLista();
  },[pagina])

  useEffect(() => {
    if(data) {
      setOrdenesDeProduccionModulo(ordenesDeProduccion?.filter((item) => item.modulo === modulo));
      let totalModulo = data?.totalModulos?.filter((item) => item.modulo === modulo);
      setTotal(totalModulo?.[0]?.total);
      if(data.length === 0) {
        setLista([]);
      } else {
        if(modulo === 0) {
          setLista(data?.datos.sort((a, b) => a.modulo - b.modulo))
        } else {
          setLista(data?.datos.filter((lista) => lista.modulo === modulo));
        }
      }
    } else {
        setLista([]);
        setOrdenesDeProduccionModulo([]);
        setTotal(0);
    }
  },[modulo, data])

  return (
    <ListaContext.Provider value={{ status, error, actualizarLista, setModulo, lista, setFechaInicio, setFechaFin, total, pagina, setPagina, ordenesDeProduccionModulo, statusOrdenes, errorOrdenes }}>
      {children}
    </ListaContext.Provider>
  );
};