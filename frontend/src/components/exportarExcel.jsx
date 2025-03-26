import React from "react";
import * as XLSX from 'xlsx';
import { Button } from "react-bootstrap";
const ExportToExcel = ({ datos }) => {
    const exportarDatos = () => {
        const workSheet = XLSX.utils.json_to_sheet(datos);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Datos");
        XLSX.writeFile(workBook, "datos.xlsx");
    }
    return (
        <Button variant="outline-success" onClick={exportarDatos}>Exportar a Excel</Button>
    )
}
export default ExportToExcel;