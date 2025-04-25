import { useQuery } from '@tanstack/react-query';
import fetchRegistrosResumidos from '../services/api/read/mostrarRegistroOperacionesResumido';
import FechaActual from '../components/fechaActual';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useRegistroOperacionesResumido = (modulo, fechaInicio, fechaFin) => {
  const { fechaActualDia } = FechaActual();
  
  // Corrección: Manejo correcto de parámetros por defecto
  const moduloSeleccionado = modulo || null;
  const fechaInicioSeleccionado = fechaInicio ?? fechaActualDia;
  const fechaFinSeleccionado = fechaFin ?? fechaActualDia;

  const { status, data, error, refetch } = useQuery({
      queryKey: ['registroOperacionesResumido', moduloSeleccionado, fechaInicioSeleccionado, fechaFinSeleccionado],
      queryFn: () => fetchRegistrosResumidos(moduloSeleccionado, fechaInicioSeleccionado, fechaFinSeleccionado),
      enabled: !!moduloSeleccionado
  });

  return { data, status, error, reload: refetch };
};

export default useRegistroOperacionesResumido;