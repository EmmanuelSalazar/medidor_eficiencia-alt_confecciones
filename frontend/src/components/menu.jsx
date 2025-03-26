import React, { useState } from 'react'
import { Menu } from 'antd'
import { CaretDownOutlined, TeamOutlined, BarsOutlined, FileAddOutlined, DatabaseOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { ListaContext } from "../contexts/informacionGrafico";
const items = [
        {
            label: <NavLink to="/modulo" className="noDecorativos">Tablero</NavLink>,
            key: 'modulos',
            icon: <CaretDownOutlined />,
            children: [
              {
                label: <NavLink to="/modulo?modulo=1" className="noDecorativos">Modulo 1</NavLink>,
                key: '1'
              },
              {
                label: <NavLink to="/modulo?modulo=2" className="noDecorativos">Modulo 2</NavLink>,
                key: '2'
              },
              {
                label: <NavLink to="/modulo?modulo=3" className="noDecorativos">Modulo 3</NavLink>,
                key: '3'
              },{
                label: <NavLink to="/modulo?modulo=4" className="noDecorativos">Modulo 4</NavLink>,
                key: '4'
              },
            ]
        },{
            label: <NavLink to="/referencias" className="noDecorativos">Referencias</NavLink>,
            key: 'referencias',
            icon: <BarsOutlined />,
            
            
        },{
            label: <NavLink to="/operarios" className="noDecorativos">Operarios</NavLink>,
            key: 'operarios',
            icon: <TeamOutlined />
        },{
          label: <NavLink to="/registro_operaciones" className="noDecorativos">Registrar operaciones</NavLink>,
          key: 'operaciones',
          icon: <FileAddOutlined />,
      },{
        label: <NavLink to="/tablaRegistros" className="noDecorativos">Tabla de registros</NavLink>,
        key: 'tablaRegistros',
        icon: <DatabaseOutlined />,
    }
];


const MenuPrincipal = () => {
  const { actualizarLista } = React.useContext(ListaContext);
  const [current, setCurrent] = useState('modulos');
  const onClick =  async (e) => {
    const { key } = e;
    let moduloSeleccionado = parseInt(key) ?? null;
    if (typeof moduloSeleccionado === 'number') {
      try  {
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

