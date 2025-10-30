import { useQuery } from '@tanstack/react-query';
import fetchOrdenesDeProduccion from '../services/api/obtenerOrdenesDeProduccion';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarOrdenesDeProduccion = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['ordenesDeProduccion'],
    queryFn: fetchOrdenesDeProduccion,
    refetchInterval: 60000
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarOrdenesDeProduccion;
