import { useQuery } from '@tanstack/react-query'
import mostrarSumatoriaReferencia from '../services/api/read/mostrarSumatoriaReferencia';
const useMostrarSumReferencias = (fecha_inicio, fecha_fin) => {
    const { status, data, error, refetch } = useQuery({
        queryKey: ['referencias'],
        queryFn: () => mostrarSumatoriaReferencia(fecha_inicio, fecha_fin),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 5 minutos
        gcTime: 1000 * 60 * 120, // LOS DATOS SE ELIMINAN DESPUÉS DE 2 HORA SIN USO
    })
    return { status, data, error, reload: refetch }
}
export default useMostrarSumReferencias