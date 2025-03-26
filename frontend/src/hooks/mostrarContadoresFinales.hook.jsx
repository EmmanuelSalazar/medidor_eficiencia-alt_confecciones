import { useQuery } from '@tanstack/react-query';
import fetchContadoresFinales from '../services/api/read/mostrarContadoresFinales';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarContadoresFinales = () => {
    const { status, data, error } = useQuery({
    queryKey: ['contadoresFinales'],
    queryFn: fetchContadoresFinales,
  })
    return { data, status, error }
}

export default useMostrarContadoresFinales;