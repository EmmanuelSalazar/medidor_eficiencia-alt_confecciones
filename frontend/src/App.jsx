import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Tablero from './pages/tableros'
import Referencias from './pages/referencias'
import Operarios from "./pages/operarios";
import TablaRegistro from './pages/tablaRegistros';
import RegistroOperaciones from './pages/registro_operaciones'
import MenuPrincipal from './components/menu'
import Informes from './pages/informes';
import { ListaProvider } from './contexts/informacionGrafico'
import FormularioLogin from './components/formularios/login';
import Estadisticas from './pages/estadisticas';
import Admin from './pages/admin';
import NotFoundPage from './pages/404';
import Bodega from './pages/bodega';
import BodegaClientes from './pages/bodega_clientes';
import InformePorOperario from './pages/informePorOperario';
import BodegaDespachos from './pages/bodega_despachos';
import Kardex from './pages/kardex';
function App() {
  const token = localStorage.getItem('token') || null;
  // Verificar que tenga un token almacenado
  if (token === null) {
    return (
      <FormularioLogin />
    )
  } else {
    const userInfo = jwtDecode(token);
    const userRol = userInfo.rol;
    const userLife = userInfo.exp;
    // Verificar que el token no haya expirado
    if (userLife < Date.now() / 1000) {
      localStorage.removeItem('token');
      return (
        <FormularioLogin />
      )
    }
    /* Hola, si eres el nuevo dev, disculpame por hacer algo tan enredado, intenté hacerlo lo mas legible posible.
    Este proyecto fué mucho aprendizaje, por lo que habrán muchas cosas sin sentido (Aunque refactorizo frecuentemente para reducir las inconsistencias) */
    return (
      <Router>
        <ListaProvider>
          <div className='noImprimir'>
          <MenuPrincipal />
          </div>
          <Routes>
            {userRol >= 1 && <Route path="/" element={<Tablero />} />}
            {userRol >= 1 && <Route path='/Tablero' element={<Tablero />}/>}
            {userRol >= 2 && <Route path='/referencias' element={<Referencias />}/>}
            {userRol >= 2 && <Route path='/operarios' element={<Operarios />}/>}
            {userRol >= 2 && <Route path='/registro_operaciones' element={<RegistroOperaciones />}/>}
            {userRol >= 2 && <Route path='/tablaRegistros' element={<TablaRegistro />}/>}
            {userRol >= 2 && <Route path='/estadisticas' element={<Estadisticas />}/>}
            {userRol >= 2 && <Route path='/admin' element={<Admin />}/>}
            {userRol >= 2 && <Route path='/informes' element={<Informes />}/>}
            {userRol >= 2 && <Route path='/informe_operario' element={<InformePorOperario />}/>}
            <Route path='/bodega_clientes' element={<BodegaClientes />}/>
            <Route path='/bodega' element={<Bodega />}/>
            <Route path='/bodega_despacho' element={<BodegaDespachos />}/>
            <Route path='/kardex' element={<Kardex />}/>
            <Route path='*' element={<NotFoundPage />}/>
          </Routes>
        </ListaProvider>
    </Router>
    )    
  }
}

export default App
