import { useQuery } from '@tanstack/react-query';
import FetchProduccion from '../services/api/read/mostrarProduccion';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarProduccion = (pagina = 1) => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['ordenProduccion', pagina],
    queryFn: async () => await FetchProduccion(pagina),
    refetchInterval: 3000 * 60 * 10,
    keepPreviousData: true
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarProduccion;