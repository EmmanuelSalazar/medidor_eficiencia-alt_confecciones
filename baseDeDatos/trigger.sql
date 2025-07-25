CREATE TRIGGER `BODEGA_verificar_estado` BEFORE INSERT ON `bodega`
 FOR EACH ROW BEGIN
    DECLARE modulo_referencia INT;
    DECLARE existe_activo INT;

    -- Obtener el módulo asociado al ref_id de la referencia
    SELECT modulo INTO modulo_referencia
    FROM referencias
    WHERE ref_id = NEW.ref_id;

    -- Verificar si hay registros en bodega con el mismo módulo y estado = 1
    SELECT COUNT(*) INTO existe_activo
    FROM bodega
    WHERE estado = 1
    AND ref_id IN (
        SELECT ref_id 
        FROM referencias 
        WHERE modulo = modulo_referencia
    );

    -- Si existe un registro activo, establecer estado = 3
    IF existe_activo > 0 THEN
        SET NEW.estado = 3;
    END IF;
END