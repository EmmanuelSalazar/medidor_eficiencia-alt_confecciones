import React, { useContext, useState, useEffect } from "react";
import useMostrarProduccion from "../hooks/mostrarProduccion.hook";
import useMostrarClientes from "../hooks/mostrarClientes.hook";
import ListaKardex from "./listas/listaKardex";
import { differenceInDays } from "date-fns";
import { Row, Col, Spinner } from 'react-bootstrap';
const KardexDespacho = () => {
    const { data:clientes } = useMostrarClientes();
    const { data:produccion } = useMostrarProduccion();
    const [cliente, setCliente] = useState(0);
    const [infoProduccion, setInfoProduccion] = useState([]);
    let fechaActual = new Date()
    const actualizarKardex = () => {
        setInfoProduccion(produccion.filter((prod) => prod.client_id === cliente).map((prod) => {
            let orden = prod.orden_produccion;
            let referencia = prod.referencia;
            let color = prod.color;
            let talla = prod.talla;
            let cantidad_recibida = prod.cantidad;
            let fecha = prod.fecha_inicio;
            let detalle = prod.detalle;
            let cantidad_entregada = prod.cantidad - prod.cantidad_producida;
            let cantidad_restante = prod.cantidad_producida;
            let vejez = differenceInDays(fechaActual, prod.fecha_inicio);
            return {orden, referencia, color, talla, cantidad_recibida, cantidad_entregada, cantidad_restante, fecha, vejez, detalle}
         }));
    }
    useEffect(() => {
        actualizarKardex();
    }, [cliente])
    if (!clientes || !produccion) return (<Spinner animation="border" variant="primary" />);


    const clienteSeleccionado = (cliente) => {
        setCliente(parseInt(cliente.target.value));
    }
    
    console.log(produccion.filter((prod) => prod.client_id === cliente))

    return (
        <>
            <Row>
                <Col lg={3}>
                    <select onChange={clienteSeleccionado} className="form-select">
                        <option value="0">Seleccione un cliente</option>
                        {clientes?.map((cliente, index) => {
                            return (
                                <option key={index} value={cliente.client_id}>{cliente.nombre}</option>
                            )
                        })}
                    </select>
                </Col>
                <Col>
                    <ListaKardex datos={infoProduccion}/>
                </Col>
            </Row>
        </>
    )
}
export default KardexDespacho