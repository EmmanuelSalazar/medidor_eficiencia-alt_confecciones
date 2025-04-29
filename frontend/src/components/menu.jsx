import React, { useState } from 'react'
import { Menu } from 'antd'
import { AppstoreOutlined, DesktopOutlined, TeamOutlined, BarsOutlined, FileAddOutlined, DatabaseOutlined, BarChartOutlined, SolutionOutlined, LogoutOutlined, SettingOutlined, MenuUnfoldOutlined, ApartmentOutlined, SnippetsOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { ListaContext } from "../contexts/informacionGrafico";
import { jwtDecode } from 'jwt-decode';
import useMostrarProduccion from '../hooks/mostrarProduccion.hook';
import CerrarSesion from './cuenta/cerrarSesion';
import FechaActual from '../components/fechaActual';
let token = localStorage.getItem('token') ?? null;
const userInfo = token != null ? jwtDecode(token) : null;
const userRol = userInfo != null ? userInfo.rol : 0;
const items = [
    userRol === 2 || userRol === 9  || userRol === 3 ? {
        label:  <NavLink to="/registro_operaciones" className="noDecorativos">Registrar operaciones</NavLink>,
        key: 'operaciones',
        icon: <FileAddOutlined />,
      }: null, userRol === 2 || userRol === 9 ? {
        label: <NavLink to="/tablaRegistros" className="noDecorativos">Lista de registros</NavLink>,
        key: 'tablaRegistros',
        icon: <DatabaseOutlined />,
      }: null, userRol === 2 || userRol === 9 ? {
        label: "Recursos",
        key: 'recursos',
        icon: <MenuUnfoldOutlined />,
        children: [
            {
              label: <NavLink to="/referencias" className="noDecorativos">Referencias</NavLink>,
              key: 'referencias',
              icon: <BarsOutlined />,
          },{
              label: <NavLink to="/operarios" className="noDecorativos">Operarios</NavLink>,
              key: 'operarios',
              icon: <TeamOutlined />
          }
        ]
      } : null, userRol === 2 || userRol === 9 ? {
        label: "Administración",
        key:'administracion',
        icon: <ApartmentOutlined />,
        children: [
            {
            label: <NavLink to="/estadisticas" className="noDecorativos">Estadisticas</NavLink>,
            key: 'estadisticas',
            icon: <BarChartOutlined />
          }, {
            label: <NavLink to="/admin" className="noDecorativos">Configuración</NavLink>,
            key: 'admin',
            icon: <SettingOutlined />
          }, {
            label: <NavLink to="/informes" className="noDecorativos">Informes</NavLink>,
            key: 'informes',
            icon: <SnippetsOutlined />
          }
        ]
      }: null,
      userRol === 1 || userRol === 2 || userRol === 9 ? {
          label: "Tableros",
          key: 'tablero',
          icon: <DesktopOutlined />,
          children: [
            {
              label: <NavLink to="/tablero?modulo=1" className="noDecorativos">Modulo 1</NavLink>,
              key: '1'
            },
            {
              label: <NavLink to="/tablero?modulo=2" className="noDecorativos">Modulo 2</NavLink>,
              key: '2'
            },
            {
              label: <NavLink to="/tablero?modulo=3" className="noDecorativos">Modulo 3</NavLink>,
              key: '3'
            },{
              label: <NavLink to="/tablero?modulo=4" className="noDecorativos">Modulo 4</NavLink>,
              key: '4'
            },
          ]
      }: null, userRol === 4 || userRol === 9 ? {
        label: "Bodega",
        key: 'bodega',
        icon: <AppstoreOutlined />,
        children: [
          {
            label: <NavLink to="/bodega" className="noDecorativos">Encargos</NavLink>,
            key: 'encargos'
          },{
            label: <NavLink to="/bodega_despacho" className="noDecorativos">Despacho</NavLink>,
            key: 'despacho'
          },{
            label: <NavLink to="/bodega_clientes" className="noDecorativos">Clientes</NavLink>,
            key: 'clientes'
          }
        ]
      } : null, {
    label: "Cuenta",
    key: 'cuenta',
    icon: <SolutionOutlined />,
    children: [
      {
        label: <NavLink onClick={CerrarSesion} to="/cerrarSesion" className="noDecorativos">Cerrar sesión</NavLink>,
        key: 'logout',
        icon: <LogoutOutlined />
      }
    ]
  }
].filter(item => item != null);
const MenuPrincipal = () => {
  const { reload } = useMostrarProduccion();
  const {fechaActualDia, corteQuincenaFormateado, anioActual} = FechaActual();
  let corteQuincena = `${anioActual}-${corteQuincenaFormateado[0].fechaInicial}`;
  const { actualizarLista, actualizarListaRegistro } = React.useContext(ListaContext);
  const [current, setCurrent] = useState('modulos');
  const onClick =  async (e) => {
    const { key } = e;
    let moduloSeleccionado = parseInt(key) ?? null;
    if (typeof moduloSeleccionado === 'number') {
      try  {
        await actualizarListaRegistro(moduloSeleccionado, fechaActualDia, fechaActualDia, null, null, 1, 0);
        await actualizarListaRegistro(moduloSeleccionado, corteQuincena, fechaActualDia, null, null, 1, 1);
        await actualizarLista(null, moduloSeleccionado);
        await reload();
      } catch (error) {
        console.error("Ha ocurrido un error: ", error)
      }
    }
    setCurrent(key);
  };
  return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />

);
}
export default MenuPrincipal

