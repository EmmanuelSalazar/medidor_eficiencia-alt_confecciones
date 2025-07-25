<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class LastScheduleFix extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function up(): void
    {
        $this->execute('DROP TRIGGER IF EXISTS calcular_meta_eficiencia');
        $sql = 'CREATE TRIGGER `calcular_meta_eficiencia` BEFORE INSERT ON `registro_produccion`
 FOR EACH ROW BEGIN
    DECLARE numeroOperarios INT DEFAULT 0;
    DECLARE tiempoReferencia DECIMAL(10,2) DEFAULT 0;
    DECLARE tiempoDeMontaje INT DEFAULT 0;
    DECLARE horarioTDM INT DEFAULT 0;
    DECLARE meta_inicial INT DEFAULT 0;
    DECLARE meta_eficiencia DECIMAL(10,2) DEFAULT 0;
    DECLARE meta_eficiencia_redondeada INT;
    DECLARE decimal_meta DECIMAL(10,2);
    DECLARE ajusteMeta DECIMAL(10,2) DEFAULT 0;
    DECLARE es_revisor INT;
    DECLARE nueva_meta_global INT;
	DECLARE tiempo_referencia DECIMAL(10,2);
DECLARE operarios_por_modulo INT;
DECLARE meta_ocho DECIMAL(10,2);
DECLARE meta_final DECIMAL(10,2);
    -- 1. Obtener número de operarios activos en el módulo
    SELECT COUNT(*) INTO numeroOperarios
    FROM operarios
    WHERE modulo = NEW.modulo AND activo = 1;

    -- 2. Obtener tiempo de producción de la referencia
    SELECT tiempoDeProduccion INTO tiempoReferencia
    FROM referencias
    WHERE ref_id = NEW.ref_id;
    
    -- OBTENER META GENERAL
    
        SELECT meta INTO meta_inicial
        FROM metas
        WHERE ref_id = NEW.ref_id
        ORDER BY meta_id DESC
        LIMIT 1;

    -- 3. Calcular base de la meta según horario
    IF NEW.horario = 9 THEN
        -- Cálculo especial para horario 9:
        IF meta_inicial IS NULL THEN
            SET meta_inicial = 0;
        END IF;
      
		SET meta_ocho = (((522 * numeroOperarios) / tiempoReferencia) / 8.7) * 8;
        SET meta_eficiencia = meta_inicial - meta_ocho;
    ELSE
        
	-- Cálculo estándar usando la tabla metas
        IF meta_inicial IS NULL THEN
            SET meta_inicial = 0;
        END IF;

        SET meta_eficiencia = meta_inicial / 8.7; -- 546 / 9.1 = 60
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
    
	SET meta_eficiencia_redondeada = FLOOR(ABS(meta_eficiencia));
    SET decimal_meta = meta_eficiencia - meta_eficiencia_redondeada;
    IF decimal_meta < 0.3 THEN
    	SET NEW.MetaPorEficiencia = FLOOR(meta_eficiencia);
    ELSE 
    	SET NEW.MetaPorEficiencia = CEILING(meta_eficiencia);
    END IF;
END';
        $this->execute($sql);
    }
    public function down(): void {
        $this->execute('DROP TRIGGER IF EXISTS calcular_meta_eficiencia');
        $sql = '
            CREATE TRIGGER `calcular_meta_eficiencia` BEFORE INSERT ON `registro_produccion`
 FOR EACH ROW BEGIN
    DECLARE numeroOperarios INT DEFAULT 0;
    DECLARE tiempoReferencia DECIMAL(10,2) DEFAULT 0;
    DECLARE tiempoDeMontaje INT DEFAULT 0;
    DECLARE horarioTDM INT DEFAULT 0;
    DECLARE meta_inicial INT DEFAULT 0;
    DECLARE meta_eficiencia DECIMAL(10,2) DEFAULT 0;
    DECLARE meta_eficiencia_redondeada INT;
    DECLARE decimal_meta DECIMAL(10,2);
    DECLARE ajusteMeta DECIMAL(10,2) DEFAULT 0;
    DECLARE es_revisor INT;
    DECLARE nueva_meta_global INT;
    -- 1. Obtener número de operarios activos en el módulo
    SELECT COUNT(*) INTO numeroOperarios
    FROM operarios
    WHERE modulo = NEW.modulo AND activo = 1;

    -- 2. Obtener tiempo de producción de la referencia
    SELECT tiempoDeProduccion INTO tiempoReferencia
    FROM referencias
    WHERE ref_id = NEW.ref_id;
    
    -- OBTENER META GENERAL
    
        SELECT meta INTO meta_inicial
        FROM metas
        WHERE ref_id = NEW.ref_id
        ORDER BY meta_id DESC
        LIMIT 1;

    -- 3. Calcular base de la meta según horario
    IF NEW.horario = 9 THEN
        -- Cálculo especial para horario 9:
        IF meta_inicial IS NULL THEN
            SET meta_inicial = 0;
        END IF;
      
        SET meta_eficiencia = meta_inicial / 8.7; -- 546 / 9.1 = 60
        
        SET meta_eficiencia_redondeada = FLOOR(ABS(meta_eficiencia));
    	SET decimal_meta = meta_eficiencia - meta_eficiencia_redondeada;
    	IF decimal_meta < 0.3 THEN
        	SET meta_eficiencia = FLOOR(meta_eficiencia);
        ELSE
        	SET meta_eficiencia = CEILING(meta_eficiencia);
    	END IF;
        SET nueva_meta_global = meta_eficiencia * 8;       
        SET meta_eficiencia =  meta_inicial - nueva_meta_global ;	
    ELSE
        
	-- Cálculo estándar usando la tabla metas
        IF meta_inicial IS NULL THEN
            SET meta_inicial = 0;
        END IF;

        SET meta_eficiencia = meta_inicial / 8.7; -- 546 / 9.1 = 60
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
    
	SET meta_eficiencia_redondeada = FLOOR(ABS(meta_eficiencia));
    SET decimal_meta = meta_eficiencia - meta_eficiencia_redondeada;
    IF decimal_meta < 0.3 THEN
    	SET NEW.MetaPorEficiencia = FLOOR(meta_eficiencia);
    ELSE 
    	SET NEW.MetaPorEficiencia = CEILING(meta_eficiencia);
    END IF;
END
        ';
        $this->execute($sql);
    }
}
