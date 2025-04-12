import Ract from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ListaUsuarios from '../components/listas/listaUsuarios';
import AgregarUsuarios from '../components/formularios/agregarUsuarios';
function Admin() {
    const token = localStorage.getItem('token') || null;
    const userInfo = jwtDecode(token);
    const userName = userInfo.nombre;
    return (
        <Container>
            <Row>
                <Col xs={12} className='mt-2 text-center'>
                    <h1>Bienvenido denuevo, <strong className='text-capitalize'>{userName}</strong></h1>
                </Col>
            </Row>
            <Row className='mt-3 text-center'>
                <Row className='justify-content-center'>
                    <h3>Gestionar usuarios</h3>
                    <Col lg={6} md={8} sm={12}>
                    <p className='text-secondary'>En esta pagina podrás gestionar factores administrativos como los usuarios con acceso al sistema y otros ajustes</p>
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
            <Row className='text-center mt-3'>
                <Row className='justify-content-center'>
                    <h3>Operarios eliminados</h3>
                    <Col lg={6} md={8} sm={12}>
                    <p className='text-secondary'>Al eliminar un operario, no se eliminará realmente, solo entrará en un estado de <strong>invisibilidad</strong>, ya que eliminar registros relacionales, podría causar inconsistencias y errores en la base de datos</p>
                    </Col>
                </Row>
                <Row>
                    <h3 className='text-secondary'>Muy pronto</h3>
                </Row>
            </Row>
        </Container>
    )
}
export default Admin