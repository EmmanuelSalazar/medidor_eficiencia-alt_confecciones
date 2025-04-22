import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { Button } from "react-bootstrap";
import { Spin } from 'antd';
const ExportToExcel = ({ datos, texto, onClick }) => {
    const[cargando, setCargando] = useState(false);
    
    const exportarDatos = async () => {
        if (onClick){
            setCargando(true);
            try {
                await onClick();
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error("Error al ejecutar la función onClick:", error);
            } finally {
                setCargando(false);
            }  
        } 
        const workSheet = XLSX.utils.json_to_sheet(datos);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Datos");
        XLSX.writeFile(workBook, "datos.xlsx");
    }
    if (cargando) return <Spin className='mt-5' tip="Cargando..."></Spin>;
    return (
        <Button className="mx-1" variant="outline-success" onClick={exportarDatos}>{texto ?? 'Exportar a Excel'}</Button>
    )
}
export default ExportToExcel;