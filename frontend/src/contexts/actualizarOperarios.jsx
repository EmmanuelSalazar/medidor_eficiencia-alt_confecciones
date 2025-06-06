import { createContext, useState, useEffect } from 'react';
import useMostrarOperarios from '../hooks/mostrarOperarios.hook';
import { useLocation } from 'react-router-dom';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const [redux, setRedux] = useState(false);
  const [modulo, setModulo] = useState(0);
  const [lista, setLista] = useState([]);
  const [operariosRetirados, setOperariosRetirados] = useState([]);
  // RECIBIR INFORMACIÓN DE LA API
  const { data, status, error, reload } = useMostrarOperarios(redux);
  const location = useLocation();
  // VACIAR LISTA DE OPERARIOS RETIRADOS AL ENTRAR EN LA PAGINA DE OPERARIOS
  useEffect(() => {
    if (location.pathname === '/operarios') {
      setOperariosRetirados([]);
    }
  }, [location]);
  // VOLVER A CARGAR TODOS LOS OPERARIOS
  useEffect(() => {
    const intervalo = setInterval(() => {
      setOperariosRetirados([]);
    }, 600000)
    return () => clearInterval(intervalo);
  })
  // MOSTRAR OPERARIOS SEGÚN EL MODULO
  useEffect(() => {
    if (data) {
      if(modulo === 0) {
        setLista(data.sort((a, b) => a.modulo - b.modulo));
      } else {
        setLista(data.filter((lista) =>  !operariosRetirados.includes(lista.op_id) && lista.modulo === modulo))
      }
    } else {
      setLista([]);
    }
  }, [modulo]);
  // MOSTRAR OPERARIOS SEGÚN EL MODULO Y ELIMINAR OPERARIOS RETIRADOS
  useEffect(() => {
    if (data) {
      setLista(data.filter((lista) =>  !operariosRetirados.includes(lista.op_id) && lista.modulo === modulo));
    } else {
      setLista([]);
    }
  }, [operariosRetirados, data]);
  // ACTUALIZAR LISTA DE OPERARIOS
  const actualizarLista = async () => {
    try {
      await reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <ListaContext.Provider value={{ setModulo, lista, status, error, setRedux, actualizarLista, operariosRetirados, setOperariosRetirados }}>
      {children}
    </ListaContext.Provider>
  );
};