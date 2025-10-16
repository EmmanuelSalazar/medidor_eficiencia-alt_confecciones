import {useContext, useState, useEffect} from 'react';
import { PlantillaDespachoContext } from '../contexts/plantillaDespacho';
import Logo from '../assets/img/logo.png';
import { Button, Form } from 'react-bootstrap';
const RotulosDespacho = () => {
    let generado = 0;
    const verificarMultiplo = (numero) => {
        return numero % 6 === 0;
    }
    const [consecutivoCaja, setConsecutivoCaja] = useState(1);
    const [consecutivoTotal, setConsecutivoTotal] = useState(0);
    const { cliente, despachos } = useContext(PlantillaDespachoContext);
    const informacionCliente = cliente || [{ nombre: 'Nombre', nit: 'NIT', direccion: 'Direccion', ciudad: 'Ciudad', telefono: 'Telefono'}];
    const [listaDespachos, setListaDespachos] = useState(despachos || [{informacionODP: [{orden_produccion: '', referencia: '', talla: '', cantidad: 0}]}]);
    const agregarDespacho = () => {
        setListaDespachos([...listaDespachos, {informacionODP: [{orden_produccion: '', referencia: '', talla: '', cantidad: 0}]}]);
    }
    useEffect(() => {
      setListaDespachos(despachos || [{informacionODP: [{orden_produccion: '', referencia: '', talla: '', cantidad: 0}]}]);
      setConsecutivoCaja(1);
      setConsecutivoTotal(despachos?.length || 1);
    }, [despachos])
    return (
        <>
        <div className='noImprimir' style={{display: 'flex', gap: '0.2rem', marginBottom: '2rem', height: '2.5rem'}}>
          <div style={{width: '30%'}}>
            <span className='text-muted'>Consecutivo Inicial</span>
            <Form.Control type='text'  value={consecutivoCaja}  placeholder='Consecutivo cajas' onChange={(e) => setConsecutivoCaja(e.target.value)} />
          </div>
          <div style={{width: '30%'}}>
            <span className='text-muted'>Consecutivo Total</span>
            <Form.Control type='text'  value={consecutivoTotal} placeholder='Consecutivo Total' onChange={(e) => setConsecutivoTotal(e.target.value)} />
          </div>
          <div className='mt-4'>
            <Button onClick={agregarDespacho}>
              Generar rotulo en blanco
            </Button>
          </div>
        </div>
        <div className='listaRotulos'>
        {listaDespachos.map((despacho, index) => {
          generado = index+1;
          var consecutivo = parseInt(consecutivoCaja) + index;
          return(
            <>
              <table key={index} className='table table-sm table-bordered'>
                  <tbody className='plantilla'>
                    <tr>
                      <th colSpan="4" rowSpan="2" ><div className='d-flex align-items-center' ><img style={{width: '30px', position: 'relative'}} className='me-2' src={Logo}/><h1>{consecutivo || index+1}/{Number(consecutivoTotal) || despachos.length}</h1></div></th>
                      <th colSpan="1">Envía: </th>
                      <td colSpan="4"> Alt Confecciones</td>
                    </tr>
                    <tr>
                      <th colSpan="1">Nit:</th>
                      <td colSpan="2">901235934</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Orden</th>
                      <td colSpan="5">{despacho?.informacionODP?.[0]?.orden_produccion || ""}</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Referencia</th>
                      <td colSpan="5">{despacho?.informacionODP?.[0]?.referencia || ""}</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Talla</th>
                      <td colSpan="5">{despacho?.informacionODP?.[0]?.talla || ""}</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Color</th>
                      <td colSpan="5">{despacho?.informacionODP?.[0]?.color || ""}</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Total unidades</th>
                      <td colSpan="5">{despacho?.sumatoria || ""}</td>
                    </tr>
                    <tr>
                      <th colSpan="3">Cliente</th>
                      <td colSpan="5">{informacionCliente[0].nombre}</td>
                    </tr>
                  </tbody>
              </table>
              {verificarMultiplo(generado) && <><div className='imprimir' style={{height: '150px'}}></div><div className='imprimir' style={{height: '150px'}}></div></>}
              </>
            )
          })}
    </div>
    <div className='noImprimir'>
    <Button variant='primary' onClick={() => window.print()}>Imprimir</Button>
    </div>
        </>
    )
}
export default RotulosDespacho;