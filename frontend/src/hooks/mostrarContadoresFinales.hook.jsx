import { useQuery } from '@tanstack/react-query';
import fetchContadoresFinales from '../services/api/read/mostrarContadoresFinales';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarContadoresFinales = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['contadoresFinales'],
    queryFn: fetchContadoresFinales,
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarContadoresFinales;