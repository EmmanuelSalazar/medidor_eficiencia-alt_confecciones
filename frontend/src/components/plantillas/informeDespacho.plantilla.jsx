// PlantillaInformeImpresion.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/img/svg/logo.svg';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// DEPRECATED: ESTA FUNCION ESTÁ BAJO REVISION, POSIBLEMENTE SEA ELIMINADA
const PlantillaInformeImpresion = React.forwardRef((props, ref) => {
    const { cliente, odp, unidades, observaciones } = props;
    const ahora = new Date();
    const fechaImpresion = format(ahora, 'PPPP', { locale: es });
    const informacionODP = odp.length !== 0 ? odp : [{ color: 'Color', talla: 'Talla', orden_produccion: 'N/A', referencia: '' }];
    const informacionCliente = cliente || [{ nombre: 'Nombre', nit: 'NIT', direccion: 'Direccion', ciudad: 'Ciudad', telefono: 'Telefono' }];

    return (
        <div ref={ref} style={{ padding: '20px' }}>
            <Row className='mb-2'>
                <Col xs={4}>
                    <img src={Logo} alt="Logo ALT Confecciones" style={{ width: '80%' }} />
                </Col>
                <Col xs={8} className='text-end'>
                    <h3>ALT Confecciones</h3>
                    <h6>NIT: 901235934</h6>
                    <span>📍Carrera 43G #27-60</span><br />
                    <span>📞(301) 489-8313</span>
                </Col>
            </Row>
            <h2 className='text-center mb-4'>REMISIÓN</h2>
            <table className='table table-bordered mb-4'>
                <tbody>
                    <tr>
                        <th colSpan="2">Cliente</th>
                        <td colSpan="4">{informacionCliente[0].nombre}</td>
                        <th colSpan="2">Elaborado por</th>
                        <td colSpan="4">ALT Confecciones</td>
                    </tr>
                    <tr>
                        <th colSpan="2">NIT</th>
                        <td colSpan="4">{informacionCliente[0].nit}</td>
                        <th colSpan="2">Fecha de Expedición</th>
                        <td colSpan="4">{fechaImpresion}</td>
                    </tr>
                    <tr>
                        <th colSpan="2">Dirección</th>
                        <td colSpan="4">{informacionCliente[0].direccion}</td>
                        <th colSpan="2">Ciudad</th>
                        <td colSpan="4">{informacionCliente[0].ciudad}</td>
                    </tr>
                    <tr>
                        <th colSpan="2">Teléfono</th>
                        <td colSpan="4">{informacionCliente[0].telefono}</td>
                        <th colSpan="2">Observaciones</th>
                        <td colSpan="4">{observaciones}</td>
                    </tr>
                </tbody>
            </table>

            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Orden de Producción</th>
                        <th>Referencia</th>
                        <th>Talla</th>
                        <th>Color</th>
                        <th>UNIDADES</th>
                    </tr>
                </thead>
                <tbody>
                    {informacionODP.map((item, index) => (
                        <tr key={index}>
                            <td>{item.orden_produccion || "N/A"}</td>
                            <td>{item.referencia}</td>
                            <td>{item.talla}</td>
                            <td>{item.color}</td>
                            <td>{unidades}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Row className='mt-5'>
                <Col>
                    <h6 className='text-center'>Firma responsable: ___________________</h6>
                </Col>
                <Col>
                    <h6 className='text-center'>Verificado por: ___________________</h6>
                </Col>
            </Row>
        </div>
    );
});

export default PlantillaInformeImpresion;