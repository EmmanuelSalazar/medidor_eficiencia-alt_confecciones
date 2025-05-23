import { useQuery } from '@tanstack/react-query'
import fetchOperarios from '../services/api/read/mostrarOperarios'

const useMostrarOperarios = (redux) => {
    const reduxSeleccionado = redux || false;
    const { status, data, error, refetch } = useQuery({
        queryKey: ['operarios'],
        queryFn: () => fetchOperarios(reduxSeleccionado),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 5 minutos
        gcTime: 1000 * 60 * 120, // LOS DATOS SE ELIMINAN DESPUÉS DE 2 HORA SIN USO
    })
    return { status, data, error, reload: refetch }
}
export default useMostrarOperarios