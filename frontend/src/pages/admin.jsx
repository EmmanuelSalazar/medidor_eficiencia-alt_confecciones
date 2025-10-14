import { Collapse } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ListaUsuarios from '../components/listas/listaUsuarios';
import AgregarUsuarios from '../components/formularios/agregarUsuarios';
import PanelAdministrativo from '../components/modal/seleccionarOperarioContador'
import TiempoDeMontaje from "../components/modal/ingresarTiempoDeMontaje.jsx";
function Admin() {
    const token = localStorage.getItem('token') || null;
    const userInfo = jwtDecode(token);
    const userName = userInfo.nombre;
    const userRol = userInfo.rol;
    const items = [
        userRol > 2 ? {
            key: '1',
            label: 'Usuarios',
            children: <Row className='mt-3 text-center'>
            <Row className='justify-content-center'>
                <h3>Gestionar usuarios</h3>
                <Col lg={6} md={8} sm={12}>
                <p className='text-secondary'>Aquí podrás gestionar a los usuarios con acceso al sistema</p>
                </Col>
            </Row>
                <Col lg={6} md={6} sm={12} className='mb-3 '>
                    <h5>Lista de usuarios</h5>
                    <ListaUsuarios />
                </Col>
                <Col lg={6} md={6} sm={12}>
                    <h5>Registrar usuario</h5>
                    <AgregarUsuarios />
                </Col>
        </Row>
        }: null,
        userRol >= 2 ? {
            key: '3',
            label: 'Adicionales',
            children: <Row className="mb-2 g-2">
            <Col lg={3}>
                <PanelAdministrativo />
            </Col>
            <Col>
                <TiempoDeMontaje />
            </Col>
        </Row>
        }: null
    ].filter(item => item != null);
    return (
        <Container>
            <Row>
                <Col xs={12} className='mt-2 text-center'>
                    <h1>Bienvenido denuevo, <strong className='text-capitalize'>{userName}</strong></h1>
                    <p className='text-secondary'>En esta pagina podrás gestionar factores administrativos como los usuarios con acceso al sistema y otros ajustes</p>         
                </Col>
            </Row>
            <Collapse items={items} />    
        </Container>
    )
}
export default Admin