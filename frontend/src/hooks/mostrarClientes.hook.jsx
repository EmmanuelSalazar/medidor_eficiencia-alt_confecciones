import { useQuery } from '@tanstack/react-query';
import FetchProduccion from '../services/api/read/mostrarClientes';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarClientes = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['clientes'],
    queryFn: FetchProduccion,
    refetchInterval: 3000 * 60 * 10 
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarClientes;