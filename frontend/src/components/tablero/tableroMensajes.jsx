import React from "react";
import { Row, Col } from "react-bootstrap";
import tableroMensajes from "../../utils/json/tableroMensajes.json";
/* import { Howl, Howler } from 'howler';
####################
DEPRECATED: Esta función ha sido marcada como en desuso y no se recomienda su uso.
####################
 */
const TableroMensajes = () => {
    const [mensaje, setMensaje] = React.useState("");
    React.useEffect(() => {
        const mensajeAleatorio = tableroMensajes[Math.floor(Math.random() * tableroMensajes.length)];
        setMensaje(mensajeAleatorio);
        /* const audio = new Howl({
            src: [`/audio/${mensaje.id}.mp3`],
            volume: 1,
            autoplay: true,
            loop: false,
        });
        audio.play(); */
    }, []); //COMING SOON
    return (
        <>
        <Row className="justify-content-center align-content-center" style={{height: "100vh"}}>
          {/* <Col lg={9}>
            <div className="bg-primary text-light text-center rounded p-2">
              <h1 className="fs-1">Mensaje del momento</h1>
              <hr className="border border-white border-2"/>
              <p className="fs-6">"{mensaje.mensaje}"</p>
              <p className="fs-3">-{mensaje.autor || "Desconocido"}</p>
            </div>
          </Col> */}
          <img src="/img/vacio.jpeg" />
        </Row>
      </>
    )
}

export default TableroMensajes;
