import React from "react";
import * as XLSX from 'xlsx';
import { Button } from "react-bootstrap";
const ExportToExcel = ({ datos, texto, onClick }) => {

    
    const exportarDatos = async () => {
        if (onClick){
            await onClick();
            await new Promise(resolve => setTimeout(resolve, 500));
        } 
        const workSheet = XLSX.utils.json_to_sheet(datos);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Datos");
        XLSX.writeFile(workBook, "datos.xlsx");
    }
    return (
        <Button className="mx-1" variant="outline-success" onClick={exportarDatos}>{texto ?? 'Exportar a Excel'}</Button>
    )
}
export default ExportToExcel;