import React from "react";
import { Stack, Col } from 'react-bootstrap';
import { ListaContext } from '../contexts/informacionGrafico';
const PanelNotificaciones = () => {
    const { lista } = React.useContext(ListaContext);
    // DEPRECATED: Esta función ha sido marcada en desuso, posiblemente sea eliminada en el futuro.
    return (
            <>
                <Stack direction="horizontal" gap={2}>
                    <Col className="notificacion" lg={6} style={{display: 'flex'}}>
                    {
                        lista.map((notificacion, index) => {
                            if (notificacion.eficiencia_int <= 69) {
                                return <div key={index} className="p-2  rounded bg-danger"><strong>{notificacion.nombre_operario}</strong> tiene un bajo rendimiento, debes mejorar <strong>┗( T﹏T )┛</strong></div>
                            } else {
                                return [];
                            }
                        })
                    }   
                    </Col>
                    <Col lg={6} className="notificacion" style={{display: 'flex'}}>
                    {
                        lista.map((notificacion, index) => {
                            if(notificacion.eficiencia_int >= 87) {
                                return <div key={index} className="p-2 rounded bg-success"><strong>{notificacion.nombre_operario}</strong> tiene un buen rendimiento, sigue así <strong>( •̀ ω •́ )✧</strong></div>
                            } else {
                                return [];
                            }
                        })
                    }
                    </Col>
                </Stack>
            </>
    )
}
export default PanelNotificaciones;