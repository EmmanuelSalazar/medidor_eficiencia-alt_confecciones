import { useQuery } from '@tanstack/react-query'
import FetchRegistrosOperaciones from '../services/api/read/mostrarRegistroOperaciones'
import FechaActual from '../components/fechaActual'
const { fechaActualDia } = FechaActual()
const useMostrarRegistroOperaciones = (modulo = null, fechaInicio = fechaActualDia, fechaFin = fechaActualDia, pagina = 1) => {
    const { status, data, error, refetch } = useQuery({
        queryKey: ['registroOperaciones', modulo, fechaInicio, fechaFin, pagina],
        queryFn: () => FetchRegistrosOperaciones(modulo, fechaInicio, fechaFin, pagina),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
        gcTime: 1000 * 60 * 120, // LOS DATOS SE ELIMINAN DESPUÉS DE 2 HORA SIN USO
        refetchInterval: 60000
    })
    return { status, data, error, reload: refetch }
}
export default useMostrarRegistroOperaciones