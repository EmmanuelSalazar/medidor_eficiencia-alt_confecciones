import { useContext, useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Logo from '../assets/img/svg/logo.svg';
import { PlantillaDespachoContext } from '../contexts/plantillaDespacho';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSearchParams } from 'react-router-dom';
const InformeDespacho = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
    const [fecha, setFecha] = useState('');
    const [consecutivoCaja, setConsecutivoCaja] = useState(1);
    const ahora = new Date();
    useEffect(() => {
     // Configura el locale al montar el componente
    setFecha(format(ahora, 'PPPP', { locale: es }));
  }, []);
    const { cliente, observaciones, despachos, fecha:fechaRegistro, numeroRemision } = useContext(PlantillaDespachoContext);
    let fechaRegistroFormateada = format(fechaRegistro || ahora, 'PPPP', { locale: es })
    const informacionCliente = cliente || [{ nombre: 'Nombre', nit: 'NIT', direccion: 'Direccion', ciudad: 'Ciudad', telefono: 'Telefono'}];
    let totalPrimeras = despachos.reduce((acumulador, despacho) => {
        return acumulador + despacho.unidadesDespachadas;
      }, 0);
    let totalSegundas = despachos.reduce((acumulador, despacho) => {
        return acumulador + despacho.bajas;
      }, 0);
    let totalBajas = despachos.reduce((acumulador, despacho) => {
        return acumulador + despacho.unidadesBajas;
      }, 0);
      // Funci├│n para obtener la cantidad de unidades por orden de producci├│n 
      // Funci├│n para consolidar los despachos
    const consolidarDespachos = (despachos) => {
        if (!Array.isArray(despachos)) return [];
        const agrupados = despachos.reduce((acumulador, despacho) => {
          // Validar estructura del despacho
          const informacionODP = despacho?.informacionODP;
          const codigoBarras = Array.isArray(informacionODP) && informacionODP[0]?.codigoBarras;
      
          if (!codigoBarras) return acumulador;
          
          // L├│gica de consolidaci├│n
          if (acumulador[codigoBarras]) {
            acumulador[codigoBarras].unidadesDespachadas += despacho.unidadesDespachadas;
          } else {
            acumulador[codigoBarras] = {
              ...despacho,
              segundas: despacho.bajas,
              unidadesDespachadas: despacho.unidadesDespachadas,
              informacionODP: [...(informacionODP || [])]
            };
          }
      
          return acumulador;
        }, {});
      
        return Object.values(agrupados);
      };
      let despachosConsolidados = consolidarDespachos(despachos);
      useEffect(() => {
        // Actualizar el estado de los despachos consolidados
        despachosConsolidados = consolidarDespachos(despachos);
      }, [despachos]);
      // Uso:
    return (
        <>  
            <Row className='d-flex justify-content-between imprimir mb-2'>
            <div className='noImprimir'>
              <input type='text' placeholder='Consecutivo Inicial' onChange={(e) => setConsecutivoCaja(e.target.value)} />
            </div>
                <Col className='d-flex flex-column justify-content-center align-items-center'>
                <Row>
                  <h1 className='imprimir'>Remisi├│n</h1>
                </Row>
                <Row>
                  <h5 className='imprimir'>N┬░ {numeroRemision < 10 ? `00${numeroRemision}` : `0${numeroRemision}`}</h5>
                </Row>
                </Col>
                <Col className='d-flex flex-column align-items-center'>
                    <h3 className='imprimir'>ALT Confecciones</h3>
                    <h6 className='imprimir'>NIT: 901235934</h6>
                    <span className='imprimir'>­ƒôìCarrera 43G #27-60</span>
                    <span className='imprimir'>­ƒô×(301) 489-8313</span>
                </Col>
                <Col className='d-flex justify-content-end'>
                    <img className='imprimir' src={Logo} width='40%' />
                </Col>
            </Row>
            <table  className='table tablaCentrada table-sm table-bordered tablaImprimir'>
	            <tbody className='plantilla'>
                    <tr>
                        <th colSpan="2">Cliente</th>
                        <td colSpan="8">{informacionCliente[0].nombre}</td>
                        <th colSpan="5">Elaborado por</th>
                    </tr>
                    <tr>
                        <th colSpan="2">NIT</th>
                        <td colSpan="8">{informacionCliente[0].nit}</td>
                        <td colSpan="5">ALT Confecciones</td>
                    </tr>
                    <tr>
                        <th colSpan="2">Direccion</th>
                        <th colSpan="4">Ciudad</th>
                        <th colSpan="4">Telefono</th>
                        <th colSpan="5">Fecha de expedicion</th>
                    </tr>
                    <tr>
                        <td colSpan="2">{informacionCliente[0].direccion}</td>
                        <td colSpan="4">{informacionCliente[0].ciudad}</td>
                        <td colSpan="4">{informacionCliente[0].telefono}</td>
                        <td colSpan="5">{fechaRegistroFormateada || fecha}</td>
                    </tr>
                    <tr>
                        <th colSpan="2">Observaciones</th>
                        <td colSpan="13" className='cortarTexto'>{observaciones}</td>
                    </tr>
                </tbody>
            </table>
            <div className='limitToPrint' style={{margin: 'none', border: 'none'}}>
              <table className='table table-sm table-bordered tablaImprimir '>
                      <tbody className='plantilla'>
                          <tr>
                              <th>#</th>
                              <th colSpan="4">Orden</th>
                              <th colSpan="4">Referencia</th>
                              <th colSpan="4">Detalles</th>
                              <th colSpan="1">Talla</th>
                              <th colSpan="4">Color</th>
                              <th colSpan="4"><span style={{ textTransform: 'capitalize', display: 'block', fontSize: '0.6rem'}}>unidades</span>Primeras</th>
                              <th colSpan="4"><span style={{ textTransform: 'capitalize', display: 'block', fontSize: '0.6rem'}}>unidades</span>Segundas</th>
                              <th colSpan="4">Total</th>
                              <th colSpan="4">Bajas</th>
                          </tr>
                          {despachos.map((despacho, index) => {
                              var consecutivo = parseInt(consecutivoCaja) + index;
                              return (
                                  <tr key={index}>
                                    <td>{consecutivo}</td>
                                    <td colSpan="4">{despacho?.informacionODP?.[0]?.orden_produccion || "N/A"}</td>
                                    <td colSpan="4">{despacho?.informacionODP?.[0]?.referencia || "N/A"}</td>
                                    <td colSpan="4">{despacho?.informacionODP?.[0]?.detalle || "N/A"}</td>
                                    <td colSpan="1">{despacho?.informacionODP?.[0]?.talla || "N/A"}</td>
                                    <td colSpan="4">{despacho?.informacionODP?.[0]?.color || "N/A"}</td>
                                    <td colSpan="4">{despacho?.unidadesDespachadas || "0"}</td>
                                    <td colSpan="4">{despacho?.bajas || 0}</td>
                                    <td colSpan="4" className='bg bg-secondary bg-opacity-10'>{despacho?.unidadesDespachadas + despacho?.bajas || 0}</td>
                                    <td colSpan="4">{despacho?.unidadesBajas || 0}</td>
                                  </tr>
                              )
                          })}
                          <tr>
                              <th colSpan={13}></th>
                              <th colSpan={5}>TOTAL UNIDADES</th>
                                <th colSpan={4} className='bg bg-secondary bg-opacity-10'>{totalPrimeras || 0}</th>
                                <th colSpan={4} className='bg bg-secondary bg-opacity-10'>{totalSegundas || 0}</th>
                              <th colSpan={4} className='bg bg-secondary bg-opacity-50'>{totalPrimeras+totalSegundas || 0}</th>
                              <th colSpan={4} className=''>{totalBajas || 0}</th>       
                          </tr>
                  </tbody>
              </table>
            </div>
            
            <Row className='d-flex mt-5'>
                <Col>
                    <h6 className='imprimir'>Firma responsable: ___________________</h6>
                </Col>
                <Col>
                    <h6 className='imprimir'>Verificado por: ___________________</h6>  
                </Col>
            </Row>
            <div className='noImprimir'>
                <table className='table table-bordered border-primary rounded'>
                    <tbody>
                        <tr >
                            <th className='bg bg-primary text-white'>
                                Orden de produccion
                            </th>
                            <th className='bg bg-primary text-white'>
                                Despachadas
                            </th>
                            <th className='bg bg-primary text-white'>
                                Por despachar
                            </th>
                        </tr>
                        {Array.isArray(despachosConsolidados) && despachosConsolidados.length > 0 ? (
          consolidarDespachos(despachos).map((despacho, index) => {
            const porDespachar = despacho?.informacionODP?.[0]?.cantidad_producida - (despacho?.unidadesDespachadas + despacho?.bajas);
            
            return (
              <tr key={`${despacho.id}-${index}`}> {/* Key ├║nico */}
                <td className='bg bg-primary bg-opacity-10'>{despacho?.informacionODP?.[0]?.orden_produccion || 'N/A'}</td>
                <td>{(despacho?.unidadesDespachadas + despacho?.bajas) || 0}</td>
                <td>{porDespachar}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="3">No hay despachos consolidados</td>
          </tr>
        )}
                 </tbody>
                 </table>
                 <div className='d-flex gap-2'>
                    <Button className={!numeroRemision && `invisible`} variant='primary' onClick={() => window.print()}>Imprimir</Button>
                    <Button className={!numeroRemision && `invisible`} onClick={() => window.open(`${apiURL}/READ/mostrarResumenRemision.php?remision=${numeroRemision}`, "Resumen")}>Generar resumen</Button>
                 </div>
            </div>
        </>
    )
}
export default InformeDespacho;
