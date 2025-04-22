-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 22-04-2025 a las 12:42:12
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `eficiencia_produccion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metas`
--

DROP TABLE IF EXISTS `metas`;
CREATE TABLE IF NOT EXISTS `metas` (
  `meta_id` int NOT NULL AUTO_INCREMENT,
  `ref_id` int DEFAULT NULL,
  `meta` int DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `ref_id` (`ref_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operarios`
--

DROP TABLE IF EXISTS `operarios`;
CREATE TABLE IF NOT EXISTS `operarios` (
  `op_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `modulo` int NOT NULL,
  `activo` int NOT NULL DEFAULT '1',
  `calculadorFinal` int NOT NULL DEFAULT '0',
  `revisador` int NOT NULL DEFAULT '0',
  `eliminado` int NOT NULL,
  PRIMARY KEY (`op_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Disparadores `operarios`
--
DROP TRIGGER IF EXISTS `actualizar_modulo_en_registros`;
DELIMITER $$
CREATE TRIGGER `actualizar_modulo_en_registros` AFTER UPDATE ON `operarios` FOR EACH ROW BEGIN
    -- Verificar si el módulo del operario ha cambiado
    IF OLD.modulo <> NEW.modulo THEN
        -- Actualizar el módulo en los registros de producción del día actual
        UPDATE registro_produccion
        SET modulo = NEW.modulo
        WHERE op_id = NEW.op_id
          AND DATE(fecha) = CURDATE(); -- Filtrar registros del día actual
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_al_actualizar_operarios`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_actualizar_operarios` AFTER UPDATE ON `operarios` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;
    DECLARE nueva_meta INT;

    -- Verificar si el módulo o el estado del operario ha cambiado
    IF OLD.modulo != NEW.modulo OR OLD.activo != NEW.activo THEN
        -- Recalcular meta para el módulo anterior (si el operario estaba activo antes)
        IF OLD.activo = 1 THEN
            SELECT COUNT(*) INTO cantidad_empleados_activos
            FROM operarios
            WHERE modulo = OLD.modulo AND activo = 1;

            -- Calcular la meta base
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
            WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1;

            -- Reducir la meta a la mitad si hay revisadores en el módulo
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR(metas.meta / 2)
            WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1
              AND EXISTS (
                  SELECT 1
                  FROM operarios
                  WHERE modulo = OLD.modulo AND activo = 1 AND revisador = 1
              );
        END IF;

        -- Recalcular meta para el nuevo módulo (si el operario está activo ahora)
        IF NEW.activo = 1 THEN
            SELECT COUNT(*) INTO cantidad_empleados_activos
            FROM operarios
            WHERE modulo = NEW.modulo AND activo = 1;

            -- Calcular la meta base
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
            WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1;

            -- Reducir la meta a la mitad si hay revisadores en el módulo
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR(metas.meta / 2)
            WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1
              AND EXISTS (
                  SELECT 1
                  FROM operarios
                  WHERE modulo = NEW.modulo AND activo = 1 AND revisador = 1
              );
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_al_eliminar_operario`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_eliminar_operario` AFTER DELETE ON `operarios` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;

    -- Verificar si el operario eliminado estaba activo
    IF OLD.activo = 1 THEN
        -- Contar cuántos operarios activos quedan en el módulo del operario eliminado
        SELECT COUNT(*) INTO cantidad_empleados_activos
        FROM operarios
        WHERE modulo = OLD.modulo AND activo = 1;

        -- Recalcular las metas para las referencias activas del módulo
        UPDATE metas
        JOIN referencias ON metas.ref_id = referencias.ref_id
        SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
        WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_al_insertar_operario`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_insertar_operario` AFTER INSERT ON `operarios` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;

    -- Verificar si el operario está activo
    IF NEW.activo = 1 THEN
        -- Contar cuántos operarios activos hay en el módulo del nuevo operario
        SELECT COUNT(*) INTO cantidad_empleados_activos
        FROM operarios
        WHERE modulo = NEW.modulo AND activo = 1;

        -- Recalcular las metas para las referencias activas del módulo
        UPDATE metas
        JOIN referencias ON metas.ref_id = referencias.ref_id
        SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
        WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `referencias`
--

DROP TABLE IF EXISTS `referencias`;
CREATE TABLE IF NOT EXISTS `referencias` (
  `ref_id` int NOT NULL AUTO_INCREMENT,
  `referencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tiempoDeProduccion` decimal(10,2) DEFAULT NULL,
  `modulo` int DEFAULT NULL,
  `activo` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ref_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Disparadores `referencias`
--
DROP TRIGGER IF EXISTS `borrar_meta_al_eliminar_referencia`;
DELIMITER $$
CREATE TRIGGER `borrar_meta_al_eliminar_referencia` AFTER DELETE ON `referencias` FOR EACH ROW BEGIN
    -- Eliminar la meta asociada a la referencia eliminada
    DELETE FROM metas
    WHERE ref_id = OLD.ref_id;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `calcular_meta_al_insertar_referencia`;
DELIMITER $$
CREATE TRIGGER `calcular_meta_al_insertar_referencia` AFTER INSERT ON `referencias` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;
    DECLARE nueva_meta INT;

    -- Contar la cantidad de operarios activos en el mismo módulo que la nueva referencia
    SELECT COUNT(*) INTO cantidad_empleados_activos
    FROM operarios
    WHERE modulo = NEW.modulo AND activo = 1;

    -- Calcular la meta base
    IF NEW.tiempoDeProduccion > 0 THEN
        SET nueva_meta = CEILING((546 * cantidad_empleados_activos) / NEW.tiempoDeProduccion);
    ELSE
        -- Manejar casos donde tiempoDeProduccion sea 0 (evitar división por cero)
        SET nueva_meta = 0;
    END IF;

    -- Reducir la meta a la mitad si hay revisadores en el módulo
    IF EXISTS (
        SELECT 1
        FROM operarios
        WHERE modulo = NEW.modulo AND activo = 1 AND revisador = 1
    ) THEN
        SET nueva_meta = FLOOR(nueva_meta / 2);
    END IF;

    -- Insertar un nuevo registro en la tabla metas con el ref_id de la nueva referencia y la meta calculada
    INSERT INTO metas (ref_id, meta)
    VALUES (NEW.ref_id, nueva_meta);
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_al_actualizar_referencia`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_actualizar_referencia` AFTER UPDATE ON `referencias` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;

    -- Verificar si el tiempoDeProduccion, modulo o activo ha cambiado
    IF OLD.tiempoDeProduccion != NEW.tiempoDeProduccion OR OLD.modulo != NEW.modulo OR OLD.activo != NEW.activo THEN
        -- Contar cuántos operarios activos hay en el módulo de la referencia actualizada
        SELECT COUNT(*) INTO cantidad_empleados_activos
        FROM operarios
        WHERE modulo = NEW.modulo AND activo = 1;

        -- Recalcular la meta para la referencia actualizada
        IF NEW.tiempoDeProduccion > 0 THEN
            UPDATE metas
            SET meta = FLOOR((546 * cantidad_empleados_activos) / NEW.tiempoDeProduccion)
            WHERE ref_id = NEW.ref_id;
        ELSE
            -- Manejar casos donde tiempoDeProduccion sea 0 (evitar división por cero)
            UPDATE metas
            SET meta = 0
            WHERE ref_id = NEW.ref_id;
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_produccion`
--

DROP TABLE IF EXISTS `registro_produccion`;
CREATE TABLE IF NOT EXISTS `registro_produccion` (
  `regProd_id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT NULL,
  `op_id` int DEFAULT NULL,
  `ref_id` int DEFAULT NULL,
  `unidadesProducidas` int DEFAULT NULL,
  `MetaPorEficiencia` decimal(10,2) DEFAULT NULL,
  `eficiencia` decimal(10,2) GENERATED ALWAYS AS ((case when (`MetaPorEficiencia` = 0) then 0 else round(((`unidadesProducidas` / `MetaPorEficiencia`) * 100),2) end)) STORED,
  `horario` int NOT NULL,
  `modulo` int NOT NULL,
  `adicionales` text,
  `rol` int NOT NULL,
  PRIMARY KEY (`regProd_id`),
  KEY `op_id` (`op_id`),
  KEY `ref_id` (`ref_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Disparadores `registro_produccion`
--
DROP TRIGGER IF EXISTS `asignar_horario_al_insertar`;
DELIMITER $$
CREATE TRIGGER `asignar_horario_al_insertar` BEFORE INSERT ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE max_horario INT;

    -- Obtener el máximo horario del operario para el mismo día
    SELECT MAX(horario) INTO max_horario
    FROM registro_produccion
    WHERE op_id = NEW.op_id
      AND DATE(fecha) = CURDATE(); -- Filtrar por el mismo día

    -- Asignar el nuevo horario
    IF max_horario IS NULL THEN
        SET NEW.horario = 1; -- Primer registro del operario en el día
    ELSE
        SET NEW.horario = max_horario + 1; -- Incrementar secuencialmente
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `asignar_modulo_al_insertar`;
DELIMITER $$
CREATE TRIGGER `asignar_modulo_al_insertar` BEFORE INSERT ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE modulo_operario INT;

    -- Paso 1: Obtener el módulo del operario
    SELECT modulo INTO modulo_operario
    FROM operarios
    WHERE op_id = NEW.op_id AND activo = 1;

    -- Verificar si se obtuvo un módulo válido
    IF modulo_operario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El operario no está activo o no tiene un módulo asignado';
    END IF;

    -- Paso 2: Asignar el módulo al nuevo registro
    SET NEW.modulo = modulo_operario;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `asignar_modulo_y_rol_al_insertar`;
DELIMITER $$
CREATE TRIGGER `asignar_modulo_y_rol_al_insertar` BEFORE INSERT ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE modulo_operario INT;
    DECLARE rol_operario INT;

    -- Obtener módulo y rol (calculadorFinal) del operario
    SELECT modulo, calculadorFinal 
    INTO modulo_operario, rol_operario
    FROM operarios
    WHERE op_id = NEW.op_id AND activo = 1;

    -- Validar y asignar valores
    IF modulo_operario IS NOT NULL AND rol_operario IS NOT NULL THEN
        SET NEW.modulo = modulo_operario,
            NEW.rol = rol_operario;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Operario no existe, está inactivo o no tiene rol definido';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `calcular_meta_eficiencia`;
DELIMITER $$
CREATE TRIGGER `calcular_meta_eficiencia` BEFORE INSERT ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE numeroOperarios INT DEFAULT 0;
    DECLARE tiempoReferencia DECIMAL(10,2) DEFAULT 0;
    DECLARE tiempoDeMontaje INT DEFAULT 0;
    DECLARE horarioTDM INT DEFAULT 0;
    DECLARE meta_inicial INT DEFAULT 0;
    DECLARE meta_eficiencia DECIMAL(10,2) DEFAULT 0;
    DECLARE ajusteMeta DECIMAL(10,2) DEFAULT 0;
    DECLARE es_revisor INT;

    -- 1. Obtener número de operarios activos en el módulo
    SELECT COUNT(*) INTO numeroOperarios
    FROM operarios
    WHERE modulo = NEW.modulo AND activo = 1;

    -- 2. Obtener tiempo de producción de la referencia
    SELECT tiempoDeProduccion INTO tiempoReferencia
    FROM referencias
    WHERE ref_id = NEW.ref_id;

    -- 3. Calcular base de la meta según horario
    IF NEW.horario = 9 THEN
        -- Cálculo especial para horario 9: 1.1*60*N°Operarios / tiempoReferencia
        IF tiempoReferencia > 0 THEN
            SET meta_eficiencia = (1.1 * 60 * numeroOperarios) / tiempoReferencia;
        ELSE
            SET meta_eficiencia = 0;
        END IF;
    ELSE
        -- Cálculo estándar usando la tabla metas
        SELECT meta INTO meta_inicial
        FROM metas
        WHERE ref_id = NEW.ref_id
        ORDER BY meta_id DESC
        LIMIT 1;

        IF meta_inicial IS NULL THEN
            SET meta_inicial = 0;
        END IF;

        SET meta_eficiencia = meta_inicial / 9.1; -- 546 / 9.1 = 60
    END IF;

    -- 4. Ajuste por tiempo de montaje (si existe)
    SELECT tiempo, horario INTO tiempoDeMontaje, horarioTDM
    FROM tiempo_de_montaje
    WHERE DATE(fecha) = DATE(NEW.fecha)
      AND modulo = NEW.modulo
      AND horario = NEW.horario
    LIMIT 1;

    IF tiempoDeMontaje > 0 AND horarioTDM = NEW.horario AND numeroOperarios > 0 AND tiempoReferencia > 0 THEN
        SET ajusteMeta = (tiempoDeMontaje * numeroOperarios) / tiempoReferencia;
        SET meta_eficiencia = meta_eficiencia - ajusteMeta;
    END IF;

    -- 5. Asegurar meta mínima de 1
    IF meta_eficiencia <= 0 THEN
        SET meta_eficiencia = 1;
    END IF;

    -- 6. Ajuste para revisores (mitad de la meta)
    SELECT revisador INTO es_revisor
    FROM operarios
    WHERE op_id = NEW.op_id;

    IF es_revisor = 1 THEN
        SET meta_eficiencia = meta_eficiencia / 2;
    END IF;

    -- 7. Asignar MetaPorEficiencia final
    SET NEW.MetaPorEficiencia = ROUND(meta_eficiencia, 2);
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_y_eficiencia_al_actualizar`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_y_eficiencia_al_actualizar` BEFORE UPDATE ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE meta_valor DECIMAL(10,2) DEFAULT 0;
    DECLARE es_revisor INT;
    DECLARE tiempoDeMontaje INT DEFAULT 0;
    DECLARE horarioTDM INT DEFAULT 0;
    DECLARE numeroOperarios INT DEFAULT 0;
    DECLARE tiempoReferencia DECIMAL(10,2) DEFAULT 0;
    DECLARE ajusteMeta DECIMAL(10,2) DEFAULT 0;
    DECLARE meta_base INT DEFAULT 0; -- Variable añadida para claridad

    -- Obtener datos necesarios
    SELECT tiempoDeProduccion INTO tiempoReferencia FROM referencias WHERE ref_id = NEW.ref_id;
    SELECT COUNT(*) INTO numeroOperarios FROM operarios WHERE modulo = NEW.modulo AND activo = 1;

    -- Lógica corregida aquí (¡esto es lo que cambié!)
    IF NEW.horario = 9 THEN
        SET meta_valor = (1.1 * 60 * numeroOperarios) / NULLIF(tiempoReferencia, 0);
    ELSE
        -- Obtener meta y DIVIDIR entre 9.1 como en el otro trigger
        SELECT COALESCE(meta, 0) INTO meta_base
        FROM metas
        WHERE ref_id = NEW.ref_id
        ORDER BY meta_id DESC
        LIMIT 1;

        SET meta_valor = meta_base / 9.1; -- ¡Aquí está el cambio clave!
    END IF;

    -- Ajuste por tiempo de montaje
    SELECT tiempo, horario INTO tiempoDeMontaje, horarioTDM
    FROM tiempo_de_montaje
    WHERE DATE(fecha) = DATE(NEW.fecha)
      AND modulo = NEW.modulo
      AND horario = NEW.horario
    LIMIT 1;

    IF tiempoDeMontaje > 0 AND horarioTDM = NEW.horario AND numeroOperarios > 0 AND tiempoReferencia > 0 THEN
        SET ajusteMeta = (tiempoDeMontaje * numeroOperarios) / tiempoReferencia;
        SET meta_valor = meta_valor - ajusteMeta;
    END IF;

    -- Asegurar meta mínima de 1
    SET meta_valor = GREATEST(meta_valor, 1);

    -- Ajuste para revisores
    SELECT revisador INTO es_revisor FROM operarios WHERE op_id = NEW.op_id;
    IF es_revisor = 1 THEN
        SET meta_valor = meta_valor / 2;
    END IF;

    -- Asignar valor final
    SET NEW.MetaPorEficiencia = ROUND(meta_valor, 2);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiempo_de_montaje`
--

DROP TABLE IF EXISTS `tiempo_de_montaje`;
CREATE TABLE IF NOT EXISTS `tiempo_de_montaje` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT NULL,
  `tiempo` int NOT NULL,
  `modulo` int NOT NULL,
  `horario` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` int NOT NULL DEFAULT '0',
  `op_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `op_id` (`op_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
