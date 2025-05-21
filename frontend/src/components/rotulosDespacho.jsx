import {useContext} from 'react';
import { PlantillaDespachoContext } from '../contexts/plantillaDespacho';
import Logo from '../assets/img/logo.png';
import { format } from 'date-fns';
import { Button } from 'react-bootstrap';
const RotulosDespacho = () => {
    let generado = 0;
    const verificarMultiplo = (numero) => {
        return numero % 6 === 0;
    }
    const { cliente, observaciones, despachos, fecha:fechaRegistro, sumatoriaUnidades } = useContext(PlantillaDespachoContext);
    const informacionCliente = cliente || [{ nombre: 'Nombre', nit: 'NIT', direccion: 'Direccion', ciudad: 'Ciudad', telefono: 'Telefono'}];
    return (
        <>
            <div className='listaRotulos'>
        {despachos.map((despacho, index) => {
            generado = index+1;
      return(
        <>
          <table key={index} className='table table-sm table-bordered'>
              <tbody className='plantilla'>
                <tr>
                  <th colSpan="1" rowSpan="2" ><div className='d-flex align-items-center' ><img style={{width: '30px', position: 'relative'}} className='me-2' src={Logo}/><h2>{index+1}/{despachos.length}</h2></div></th>
                  <th colSpan="2">Envía: </th>
                  <td colSpan="5"> Alt Confecciones</td>
                </tr>
                <tr>
                  <th colSpan="2">Nit:</th>
                  <td colSpan="3">901235934</td>
                </tr>
                <tr>
                  <th colSpan="3">Orden de produccion</th>
                  <td colSpan="5">{despacho?.informacionODP?.[0]?.orden_produccion || "N/A"}</td>
                </tr>
                <tr>
                  <th colSpan="3">Referencia</th>
                  <td colSpan="5">{despacho?.informacionODP?.[0]?.referencia || "N/A"}</td>
                </tr>
                <tr>
                  <th colSpan="3">Talla</th>
                  <td colSpan="5">{despacho?.informacionODP?.[0]?.talla || "N/A"}</td>
                </tr>
                <tr>
                  <th colSpan="3">Color</th>
                  <td colSpan="5">{despacho?.informacionODP?.[0]?.color || "N/A"}</td>
                </tr>
                <tr>
                  <th colSpan="3">Total unidades</th>
                  <td colSpan="5">{despacho?.sumatoria || "0"}</td>
                </tr>
                <tr>
                  <th colSpan="3">Cliente</th>
                  <td colSpan="5">{informacionCliente[0].nombre}</td>
                </tr>
              </tbody>
          </table>
          {verificarMultiplo(generado) && <><div className='imprimir' style={{height: '200px'}}></div><div className='imprimir' style={{height: '200px'}}></div></>}
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