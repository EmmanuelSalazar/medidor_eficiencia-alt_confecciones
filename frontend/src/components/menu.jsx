import React, { useState } from 'react'
import { Menu } from 'antd'
import { CaretDownOutlined, TeamOutlined, BarsOutlined, FileAddOutlined, DatabaseOutlined, BarChartOutlined, SolutionOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { ListaContext } from "../contexts/informacionGrafico";
import { jwtDecode } from 'jwt-decode';
import CerrarSesion from './cuenta/cerrarSesion';
import { useSearchParams } from "react-router-dom";
import FechaActual from '../components/fechaActual';
let token = localStorage.getItem('token') ?? null;
const userInfo = token != null ? jwtDecode(token) : null;
const userRol = userInfo != null ? userInfo.rol : 0;
const items = [
  userRol >= 1 ? {
          label: <NavLink to="/tablero" className="noDecorativos">Tablero</NavLink>,
          key: 'tablero',
          icon: <CaretDownOutlined />,
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
      }: null, userRol >= 2 ? {
          label: <NavLink to="/referencias" className="noDecorativos">Referencias</NavLink>,
          key: 'referencias',
          icon: <BarsOutlined />,
      }: null, userRol >= 2 ? {
          label: <NavLink to="/operarios" className="noDecorativos">Operarios</NavLink>,
          key: 'operarios',
          icon: <TeamOutlined />
      }: null, userRol >= 2 ? {
        label:  <NavLink to="/registro_operaciones" className="noDecorativos">Registrar operaciones</NavLink>,
        key: 'operaciones',
        icon: <FileAddOutlined />,
    }: null, userRol >= 2 ? {
      label: <NavLink to="/tablaRegistros" className="noDecorativos">Lista de registros</NavLink>,
      key: 'tablaRegistros',
      icon: <DatabaseOutlined />,
  }: null, userRol >= 2 ? {
    label: <NavLink to="/estadisticas" className="noDecorativos">Estadisticas</NavLink>,
    key: 'estadisticas',
    icon: <BarChartOutlined />
  }: null, userRol > 2 ? {
    label: <NavLink to="/admin" className="noDecorativos">Admin</NavLink>,
    key: 'admin',
    icon: <SettingOutlined />
  }: null, {
    label: <NavLink to="/#" className="noDecorativos">Cuenta</NavLink>,
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
  const {fechaActualDia, corteQuincenaFormateado, anioActual} = FechaActual();
    let corteQuincena = `${anioActual}-${corteQuincenaFormateado[0].fechaInicial}`;
  const [buscarParametro] = useSearchParams();
  let moduloEnLaUrl = parseInt(buscarParametro.get('modulo'));
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
      } catch (error) {
        console.error("Ha ocurrido un error: ", error)
      }
    } else {
    }
    setCurrent(key);
  };
  return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />

);
}
export default MenuPrincipal

