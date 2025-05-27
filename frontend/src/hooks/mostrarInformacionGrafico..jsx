import { useQuery } from '@tanstack/react-query';
import FetchInformacionGrafico from '../services/api/read/mostrarInformacionGrafico';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarInformacionGrafico = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['informacionGrafico'],
    queryFn: FetchInformacionGrafico,
    refetchInterval: 60000
  })
    return { data, status, error, reload: refetch }
}
export default useMostrarInformacionGrafico;