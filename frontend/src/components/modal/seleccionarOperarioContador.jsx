import React from "react";
import { Modal, Input, Form, Alert } from 'antd'
import { Button } from "react-bootstrap";
import ListaContadoresFinales from "../listas/listaContadoresFinales";
import ActualizarOperario from "../../services/api/update/actualizarOperario";
const PanelAdministrativo = () => {
    const [mensajeDeExito, setMensajeDeExito] = React.useState("");
    const { actualizarOperario } = ActualizarOperario();
    const [visible, setVisible] = React.useState(false);
    const [valorInput, setValorInput] = React.useState("");
    const [subVisibleModal, setSubVisibleModal] = React.useState(false);

    const handleChange = (e) => {
        setValorInput(e.target.value);
    };
    React.useEffect(() => {
            if (mensajeDeExito) {
                const timer = setTimeout(() => {
                    setMensajeDeExito("");
                }, 3000);
    
                return () => clearTimeout(timer);
            }
        }, [mensajeDeExito]);
    // MODAL PRINCIPAL
    const showModal = () => { 
        setVisible(true)
    }

    const handleOk = () => {
        setVisible(false)
    }

    const handleCancel = () => { 
        setVisible(false)
    }
    // SUB MODAL
    const showSubModal = () => { 
        setSubVisibleModal(true)
    }

    const handleSubOk = async () => {
        console.log(valorInput)
        try {
            await actualizarOperario(valorInput, true);
            setMensajeDeExito("El operario ha sido actualizado con exito, deberá recargar para ver los datos en esta tabla");
        } catch (error) {
            console.error("Ha ocurrido un error: ", error)
        }
        setSubVisibleModal(false)
    }


    const handleSubCancel = () => { 
        setSubVisibleModal(false)
    }
    return (
        <>
            <Button size="sm" variant="primary" onClick={showModal}>Operarios que funcionan como contadores</Button>
            <Modal title="Operarios que funcionan como contadores" open={visible} onOk={handleOk} onCancel={handleCancel} width={{xl: '70%', xxl: '70%'}}> 
            {mensajeDeExito && <Alert message={mensajeDeExito} type="success" showIcon />}
            <ListaContadoresFinales />
            <Button type="primary" onClick={showSubModal}>Actualizar operarios que funcionan como contadores</Button>
            <Modal title="Actualizar el operario con el que se calcula la eficiencia" open={subVisibleModal} onOk={handleSubOk} onCancel={handleSubCancel} width={{xl: '40%', xxl: '40%'}}>
                <Form>
                    <Form.Item label="Ingrese el ID del operario" name="op_id" rules={[{ required: true}]} help="Al actualizar los datos, se eliminará al antiguo operario que funcionaba como contador en el modulo">
                        <Input type="number" placeholder="Este número lo consigues en la pestaña 'operarios'" onChange={handleChange}/>
                    </Form.Item>
                </Form>
            </Modal>
            </Modal>
        </>
    )
}
export default PanelAdministrativo