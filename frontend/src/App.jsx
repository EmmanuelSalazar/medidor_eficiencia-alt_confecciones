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
import { ListaProvider } from './contexts/informacionGrafico'
import FormularioLogin from './components/formularios/login';
function App() {
  const token = localStorage.getItem('token') || null;
  if (token === null) {
    return (
      <FormularioLogin />
    )
  } else {
    const userInfo = jwtDecode(token);
    const userRol = userInfo.rol;
    return (
      <Router>
        <ListaProvider>
          <MenuPrincipal />
          <Routes>
            {userRol >= 1 && <Route path="/" element={<Tablero />} />}
            {userRol >= 1 && <Route path='/Tablero' element={<Tablero />}/>}
            {userRol >= 2 && <Route path='/referencias' element={<Referencias />}/>}
            {userRol >= 2 && <Route path='/operarios' element={<Operarios />}/>}
            {userRol >= 2 && <Route path='/registro_operaciones' element={<RegistroOperaciones />}/>}
            {userRol >= 2 && <Route path='/tablaRegistros' element={<TablaRegistro />}/>}
          </Routes>
        </ListaProvider>
    </Router>
    )    
  }
}

export default App
