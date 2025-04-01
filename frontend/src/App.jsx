import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
    return (
      <Router>
        <ListaProvider>
          <MenuPrincipal />
          <Routes>
            <Route path="/" element={<Tablero />} />
            <Route path='/Tablero' element={<Tablero />}/>
            <Route path='/referencias' element={<Referencias />}/>
            <Route path='/operarios' element={<Operarios />}/>
            <Route path='/registro_operaciones' element={<RegistroOperaciones />}/>
            <Route path='/tablaRegistros' element={<TablaRegistro />}/>
          </Routes>
        </ListaProvider>
      </Router>
    )
}

export default App
