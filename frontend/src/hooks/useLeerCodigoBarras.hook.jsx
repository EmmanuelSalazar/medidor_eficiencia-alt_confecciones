import { useState, useEffect, useRef } from 'react';

const useLeerCodigoBarras = ({ minLength = 6, delay = 50 }) => {
    const [codigo, setCodigo] = useState({ valor: '', timestamp: 0 });
    const bufferRef = useRef('');
    const timeoutRef = useRef();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (document.activeElement.tagName === 'INPUT') return;

            bufferRef.current += e.key;
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                if (bufferRef.current.length >= minLength) {
                    const nuevoCodigo = bufferRef.current.replace(/[^\d]/g, '');
                    setCodigo({
                        valor: nuevoCodigo,
                        timestamp: Date.now() // <-- Timestamp único por escaneo
                    });
                }
                bufferRef.current = '';
            }, delay);
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => document.removeEventListener('keypress', handleKeyPress);
    }, [minLength, delay]);

    return codigo; // <-- Ahora retorna { valor, timestamp }
};

export default useLeerCodigoBarras;