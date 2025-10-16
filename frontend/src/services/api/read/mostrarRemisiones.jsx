import axios from 'axios';
import { useState } from 'react';
// FUNCION PARA OBTENER DATOS
export const FetchRemisiones = async () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const query = await axios.get(`${apiURL}/READ/mostrarRemisiones.php`);
    if (query.data.ok) {
        return query.data.respuesta;
    } else {
        throw new Error(query.data.respuesta || 'Ha ocurrido un error al realizar la solicitud');
    }
};
export const FetchRemisionDetallada = async (remision) => {
    const apiURL = import.meta.env.VITE_API_URL;
    try {
        const query = await axios.get(`${apiURL}/READ/mostrarRemisiones.php/detallarRemision?remision=${remision}`);
        if (query.data.ok) {
            return query.data.respuesta;
        } else {
            throw new Error(query.data.respuesta || 'Ha ocurrido un error al realizar la solicitud');
        }
    } catch (error) {
        throw new Error(error.message || 'Ha ocurrido un error al realizar la solicitud');
    }
};