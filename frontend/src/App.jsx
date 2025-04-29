import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css'
import './assets/css/custom.scss'
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
import BodegaDespachos from './pages/bodega_despachos';
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
            <Route path='/bodega_clientes' element={<BodegaClientes />}/>
            <Route path='/bodega' element={<Bodega />}/>
            <Route path='/bodega_despacho' element={<BodegaDespachos />}/>
            <Route path='*' element={<NotFoundPage />}/>
          </Routes>
        </ListaProvider>
    </Router>
    )    
  }
}

export default App
