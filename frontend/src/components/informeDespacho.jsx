import { useContext, useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Logo from '../assets/img/svg/logo.svg';
import { PlantillaDespachoContext } from '../contexts/plantillaDespacho';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InformeDespacho = () => {
    const [fecha, setFecha] = useState('');
    const ahora = new Date();
    useEffect(() => {
     // Configura el locale al montar el componente
    setFecha(format(ahora, 'PPPP', { locale: es }));
  }, []);
    const { cliente, observaciones, despachos, fecha:fechaRegistro } = useContext(PlantillaDespachoContext);
    let fechaRegistroFormateada = format(fechaRegistro || ahora, 'PPPP', { locale: es })
    const informacionCliente = cliente || [{ nombre: 'Nombre', nit: 'NIT', direccion: 'Direccion', ciudad: 'Ciudad', telefono: 'Telefono'}];
    return (
        <>  
            <Row>
                <h1 className='noImprimir text-muted'>Plantilla</h1>
            </Row>
            <Row className='d-flex justify-content-between imprimir mb-2'>
                <Col className='d-flex align-items-center'>
                    <h1 className='imprimir'>REMISIÓN</h1>
                </Col>
                <Col className='d-flex flex-column align-items-center'>
                    <h3 className='imprimir'>ALT Confecciones</h3>
                    <h6 className='imprimir'>NIT: 901235934</h6>
                    <span className='imprimir'>📍Carrera 43G #27-60</span>
                    <span className='imprimir'>📞(301) 489-8313</span>
                </Col>
                <Col className='d-flex justify-content-end'>
                    <img className='imprimir' src={Logo} width='40%' />
                </Col>
            </Row>
            <table className='table table-bordered'>
	            <tbody className='plantilla'>
                    <tr>
                        <th colSpan="4">Cliente</th>
                        <td colSpan="8">{informacionCliente[0].nombre}</td>
                        <th colSpan="5">Elaborado por</th>
                    </tr>
                    <tr>
                        <th colSpan="4">NIT</th>
                        <td colSpan="8">{informacionCliente[0].nit}</td>
                        <td colSpan="5">ALT Confecciones</td>
                    </tr>
                    <tr>
                        <th colSpan="4">Direccion</th>
                        <th colSpan="4">Ciudad</th>
                        <th colSpan="4">Telefono</th>
                        <th colSpan="5">Fecha de expedicion</th>
                    </tr>
                    <tr>
                        <td colSpan="4">{informacionCliente[0].direccion}</td>
                        <td colSpan="4">{informacionCliente[0].ciudad}</td>
                        <td colSpan="4">{informacionCliente[0].telefono}</td>
                        <td colSpan="5">{fechaRegistroFormateada || fecha}</td>
                    </tr>
                    <tr>
                        <th colSpan="4">Observaciones</th>
                        <td colSpan="13">{observaciones}</td>
                    </tr>
                </tbody>
            </table>
            <table className='table table-bordered'>
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th colSpan="4">Orden de produccion</th>
                            <th colSpan="4">Referencia</th>
                            <th colSpan="4">Talla</th>
                            <th colSpan="4">Color</th>
                            <th colSpan="4">UNIDADES</th>
                        </tr>
                        {despachos.map((despacho, index) => {
                            return (
                                <tr key={index}>
                                <td>{index+1}</td>
                                <td colSpan="4">{despacho?.informacionODP?.[0]?.orden_produccion || "N/A"}</td>
                                <td colSpan="4">{despacho?.informacionODP?.[0]?.referencia || "N/A"}</td>
                                <td colSpan="4">{despacho?.informacionODP?.[0]?.talla || "N/A"}</td>
                                <td colSpan="4">{despacho?.informacionODP?.[0]?.color || "N/A"}</td>
                                <td colSpan="4">{despacho?.unidadesDespachadas || "N/A"}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <Row className='d-flex mt-5'>
                <Col>
                    <h6 className='imprimir'>Firma responsable: ___________________</h6>
                </Col>
                <Col>
                    <h6 className='imprimir'>Verificado por: ___________________</h6>  
                </Col>
            </Row>
            <div className='noImprimir'>
                <Button variant='primary' onClick={() => window.print()}>Imprimir</Button>
            </div>
        </>
    )
}
export default InformeDespacho;