import { useQuery } from '@tanstack/react-query';
import fetchSumatoriaPorDias from '../services/api/read/mostrarSumatoriaPorDias';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarSumatoriaPorDias = (dia_inicio, dia_fin, operario) => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['sumatoriaPorDias', dia_inicio, dia_fin, operario],
    queryFn: () => fetchSumatoriaPorDias(dia_inicio, dia_fin, operario),
    refetchInterval: 60000
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarSumatoriaPorDias;
