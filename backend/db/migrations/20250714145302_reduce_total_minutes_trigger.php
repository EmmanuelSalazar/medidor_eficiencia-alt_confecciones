<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class ReduceTotalMinutesTrigger extends AbstractMigration
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
        $this->execute('DROP TRIGGER IF EXISTS `calcular_meta_al_insertar_referencia`;');
        $sql = '
            CREATE TRIGGER `calcular_meta_al_insertar_referencia` AFTER INSERT ON `referencias`
        FOR EACH ROW BEGIN
            DECLARE cantidad_empleados_activos INT;
            DECLARE nueva_meta INT;

            -- Contar la cantidad de operarios activos en el mismo módulo que la nueva referencia
            SELECT COUNT(*) INTO cantidad_empleados_activos
            FROM operarios
            WHERE modulo = NEW.modulo AND activo = 1;

            -- Calcular la meta base
            IF NEW.tiempoDeProduccion > 0 THEN
                SET nueva_meta = CEILING((522 * cantidad_empleados_activos) / NEW.tiempoDeProduccion);
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
        END;
                ';
        $this->execute($sql);
    }
    public function down():void {
        $this->execute('DROP TRIGGER IF EXISTS `calcular_meta_al_insertar_referencia`;');
        $sql = '
            CREATE TRIGGER `calcular_meta_al_insertar_referencia` AFTER INSERT ON `referencias`
        FOR EACH ROW BEGIN
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
        END;
                ';
        $this->execute($sql);
    }
}
