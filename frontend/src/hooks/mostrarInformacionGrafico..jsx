import { useQuery } from '@tanstack/react-query';
import FetchInformacionGrafico from '../services/api/read/mostrarInformacionGrafico';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarInformacionGrafico = (fecha) => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['informacionGrafico', fecha],
    queryFn: () => FetchInformacionGrafico(fecha),
    refetchInterval: 60000
  })
    return { data, status, error, reload: refetch }
}
export default useMostrarInformacionGrafico;