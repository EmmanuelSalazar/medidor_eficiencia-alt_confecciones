import { useQuery } from '@tanstack/react-query';
import fetchUsuarios from '../services/api/read/mostrarUsuarios';
// HOOK PARA ALMACENAR Y PROCESAR DATOS EN CACHÉ
const useMostrarUsuarios = () => {
    const { status, data, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  })
    return { data, status, error, reload: refetch }
}

export default useMostrarUsuarios;