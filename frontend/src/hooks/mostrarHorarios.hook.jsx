import { useQuery } from '@tanstack/react-query';
import FetchHorarios from '../services/api/read/mostrarIngresosPorHoras';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarHorarios = (fecha) => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['horarios', fecha],
    queryFn: () => FetchHorarios(fecha),
    staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 5 minutos
    gcTime: 1000 * 60 * 60, // LOS DATOS SE ELIMINAN DESPUÉS DE 2 HORA SIN USO
  })
    return { data, status, error, reload: refetch }
}
export default useMostrarHorarios;