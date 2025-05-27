import { useQuery } from '@tanstack/react-query'
import FetchRegistrosOperaciones from '../services/api/read/mostrarRegistroOperaciones'
const useMostrarRegistroOperaciones = () => {
    const { status, data, error, refetch } = useQuery({
        queryKey: ['registroOperaciones'],
        queryFn: FetchRegistrosOperaciones,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
        gcTime: 1000 * 60 * 120, // LOS DATOS SE ELIMINAN DESPUÉS DE 2 HORA SIN USO
        refetchInterval: 60000
    })
    return { status, data, error, reload: refetch }
}
export default useMostrarRegistroOperaciones