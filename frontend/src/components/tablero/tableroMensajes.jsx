import React from "react";
import { Row, Col } from "react-bootstrap";
import tableroMensajes from "../../utils/json/tableroMensajes.json";
const TableroMensajes = () => {
    const [mensaje, setMensaje] = React.useState("");
    React.useEffect(() => {
        const mensajeAleatorio = tableroMensajes[Math.floor(Math.random() * tableroMensajes.length)];
        setMensaje(mensajeAleatorio.mensaje);
    }, []);
    return (
        <>
        <Row className="justify-content-center align-content-center" style={{height: "100vh"}}>
          <Col lg={9}>
            <div className="bg-primary text-light text-center rounded p-2">
              <h1 className="fs-1">Mensaje del momento</h1>
              <hr className="border border-white border-2"/>
              <p className="fs-6">"{mensaje}"</p>
            </div>
          </Col>
        </Row>
      </>
    )
}

export default TableroMensajes;
