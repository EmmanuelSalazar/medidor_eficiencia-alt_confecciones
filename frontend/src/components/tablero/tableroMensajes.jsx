import React from "react";
import { Row, Col } from "react-bootstrap";
import tableroMensajes from "../../utils/json/tableroMensajes.json";
/* import { Howl, Howler } from 'howler';
####################
DEPRECATED: Esta función ha sido marcada como en desuso y no se recomienda su uso.
####################
 */
const TableroMensajes = ( { notificacion, imagen }) => {
    const [mensaje, setMensaje] = React.useState("");
    React.useEffect(() => {
        setMensaje(notificacion);
    }, [notificacion]);
    return (
        <>
        <Row className="justify-content-center align-content-center" style={{height: "100vh"}}>
          <Col lg={9}>
            <div className="bg-primary text-light text-center rounded p-2">
              <h1 className="fs-1">Mensaje del momento</h1>
              <hr className="border border-white border-2"/>
              <p className="fs-6">"{mensaje}"</p>
              {imagen !== null && (
                <img src={imagen} alt="Notificación" style={{ width: '100%', height: 'auto' }} />
              )}
            </div>
          </Col>
        </Row>
      </>
    )
}

export default TableroMensajes;
