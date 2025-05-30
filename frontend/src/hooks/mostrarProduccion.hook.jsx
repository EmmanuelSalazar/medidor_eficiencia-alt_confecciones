import { useQuery } from '@tanstack/react-query';
import FetchProduccion from '../services/api/read/mostrarProduccion';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarProduccion = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['ordenProduccion'],
    queryFn: FetchProduccion,
    refetchInterval: 3000 * 60 * 10 
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarProduccion;