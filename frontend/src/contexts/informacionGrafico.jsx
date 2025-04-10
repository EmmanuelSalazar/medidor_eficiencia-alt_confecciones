import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/read/registro_produccion';
import { useFetchData as RegistroOperaciones } from '../services/api/read/mostrarRegistroOperaciones';
import { useSearchParams } from "react-router-dom";
export const ListaContext = createContext();
import FechaActual from '../components/fechaActual';

export const ListaProvider = ({ children }) => {
  // COMPONENTE DE FECHA
  const { fechaActualDia } = FechaActual();
  const [buscarParametro] = useSearchParams();
  let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
  // RECIBIR DATOS DE LA API
   // GRAFICA
  const { data, loading, error, fetchData } = useFetchData();
  // REGISTRO DE OPERACIONES
  const { fetchData: fetchDataRegistro } = RegistroOperaciones();
  // ALMACENAR LOS DATOS DE LAS API
  const [lista, setLista] = useState([]);
  const [listaRegistro, setListaRegistro] = useState([]);
  const [listaRegistroQuincenal, setListaRegistroQuincenal] = useState([]);
  // HOOK PARA REALIZAR Y ALMACENAR INsFORMACION
  const actualizarLista = async (fecha, modulo, operarios) => {
    window.moduloConsultado = modulo || moduloEnLaUrl || window.moduloConsultado;
    window.fechaConsultada = fecha ?? fechaActualDia;
    window.operariosConsultados = operarios
    try {
      const nuevaLista = await fetchData(fechaConsultada, moduloConsultado, operarios);
      if (!Array.isArray(nuevaLista)) {
        console.error("La respuesta no es un array:", nuevaLista);
        return;
    }
      setLista([...nuevaLista]);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };
  // HOOK API REGISTRO DE OPERACIONES
  const actualizarListaRegistro = async (modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin, rol, tipo) => {
    modulo = modulo ?? moduloEnLaUrl;
    try {
      const nuevaLista = await fetchDataRegistro(modulo, fecha_inicio, fecha_final, hora_inicio, hora_fin, rol);
      if(tipo === 1) {
        setListaRegistroQuincenal([...nuevaLista]);
      } else {
        setListaRegistro([...nuevaLista]);
      }
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
      throw error;
    }
  };
  // ACTUALIZAR HOOK CADA 60 SEGUNDOS (60000MLS)
  useEffect(() => {
    const interval = setInterval(() => {
      actualizarLista(window.fechaConsultada, window.moduloConsultado, window.operariosConsultados);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
        
  useEffect(() => {
    actualizarLista();
  actualizarListaRegistro(window.moduloConsultado || moduloEnLaUrl, fechaActualDia, null, null, null, 1);
  }, [fetchData]);
  
  

  return (
    <ListaContext.Provider value={{ lista, loading, error, actualizarLista, actualizarListaRegistro, listaRegistro, listaRegistroQuincenal }}>
      {children}
    </ListaContext.Provider>
  );
};
