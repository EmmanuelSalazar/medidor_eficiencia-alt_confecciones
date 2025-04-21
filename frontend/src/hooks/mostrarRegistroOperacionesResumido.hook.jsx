import { useQuery } from '@tanstack/react-query';
import fetchRegistrosResumidos from '../services/api/read/mostrarRegistroOperacionesResumido';
import FechaActual from '../components/fechaActual';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useRegistroOperacionesResumido = (modulo, fechaInicio, fechaFin) => {
    const { fechaActualDia } = FechaActual();
    let moduloSeleccionado = modulo
    let fechaInicioSeleccionado = typeof fechaInicio != 'undefined' || null ? fechaInicio : fechaActualDia;
    let fechaFinSeleccionado = typeof fechaFin != 'undefined' || null ? fechaFin : fechaActualDia;
    
    const { status, data, error, refetch } = useQuery({
    queryKey: ['registroOperacionesResumido', modulo, fechaInicio, fechaFin],
    queryFn: () => fetchRegistrosResumidos(moduloSeleccionado, fechaInicioSeleccionado, fechaFinSeleccionado),
    enabled: !!modulo
  })
    return { data, status, error, reload: () => refetch() }
}

export default useRegistroOperacionesResumido;