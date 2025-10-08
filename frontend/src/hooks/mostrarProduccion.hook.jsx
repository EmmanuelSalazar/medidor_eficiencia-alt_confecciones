import { useQuery } from '@tanstack/react-query';
import FetchProduccion from '../services/api/read/mostrarProduccion';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACH├ë
const useMostrarProduccion = (pagina = 1, activos = 0) => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['ordenProduccion', pagina, activos],
    queryFn: async () => await FetchProduccion(pagina, activos),
    refetchInterval: 3000 * 60 * 10,
    keepPreviousData: true
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarProduccion;
