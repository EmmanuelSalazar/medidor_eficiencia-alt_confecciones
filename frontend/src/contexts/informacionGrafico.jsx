import { createContext, useState, useEffect } from 'react';
import useMostrarInformacionGrafico from '../hooks/mostrarInformacionGrafico.hook'; 
import { useSearchParams } from 'react-router-dom';
export const ListaContext = createContext();
import FechaActual from '../components/fechaActual';

export const ListaProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const moduloEnLaUrl = parseInt(searchParams.get('modulo'));
  const [modulo, setModulo] = useState(0);
  const [eficiencia, setEficiencia] = useState([]);
  const [listaOperarios, setListaOperarios] = useState([]);
  const [fecha, setFecha] = useState();
  const { data, status, error, reload } = useMostrarInformacionGrafico(fecha);

  useEffect(() => {
    if(moduloEnLaUrl) {
      setModulo(moduloEnLaUrl);
    }
  }, [moduloEnLaUrl]);
  useEffect(() => {
    reload();
  }, [fecha])
  useEffect(() => {
    if(data) {
      if(modulo === 0) {
        setEficiencia([]);
        setListaOperarios([]);
      } else {
        setEficiencia(data[1].filter(item => item.modulo === modulo));
        setListaOperarios(data[0].filter(item => item.modulo === modulo));
      }
    }
  }, [data, modulo]);

  return (
    <ListaContext.Provider value={{ setModulo, eficiencia, listaOperarios, status, error, setFecha }}>
      {children}
    </ListaContext.Provider>
  );
};
