import { useQuery } from '@tanstack/react-query';
import FetchRemisiones from '../services/api/read/mostrarRemisiones';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarRemisiones = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['listaRemisiones'],
    queryFn: FetchRemisiones,
    staleTime: 5000 * 60,
    cacheTime: 5000 * 60
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarRemisiones;