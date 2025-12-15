<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class EliminarTriggersEnDeshuso extends AbstractMigration
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
            $sql = "DROP TRIGGER IF EXISTS 	borrar_meta_al_eliminar_referencia";
            $this->execute($sql);
                
            $sql = "DROP TRIGGER IF EXISTS calcular_meta_al_insertar_referencia";
            $this->execute($sql);

            $sql = "DROP TRIGGER IF EXISTS recalcular_meta_al_actualizar_operarios";
            $this->execute($sql);

            $sql = "DROP TRIGGER IF EXISTS recalcular_meta_al_actualizar_referencia";
            $this->execute($sql);

            $sql = "DROP TRIGGER IF EXISTS recalcular_meta_al_eliminar_operario";
            $this->execute($sql);

            $sql = "DROP TRIGGER IF EXISTS 	recalcular_meta_al_insertar_operario";
            $this->execute($sql);
    }
    public function down(): void
    {
        $sql = "CREATE TRIGGER `borrar_meta_al_eliminar_referencia` AFTER DELETE ON `referencias`
                    FOR EACH ROW BEGIN
                        -- Eliminar la meta asociada a la referencia eliminada
                        DELETE FROM metas
                        WHERE ref_id = OLD.ref_id;
                    END

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
                            END

                    CREATE TRIGGER `recalcular_meta_al_actualizar_operarios` AFTER UPDATE ON `operarios`
                    FOR EACH ROW BEGIN
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
                                SET metas.meta = FLOOR((522 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
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
                                SET metas.meta = FLOOR((522 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
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

                    CREATE TRIGGER `recalcular_meta_al_actualizar_referencia` AFTER UPDATE ON `referencias`
                    FOR EACH ROW BEGIN
                                        DECLARE cantidad_empleados_activos INT;

                                            -- Contar cuántos operarios activos hay en el módulo de la referencia actualizada
                                            SELECT COUNT(*) INTO cantidad_empleados_activos
                                            FROM operarios
                                            WHERE modulo = NEW.modulo AND activo = 1;

                                            -- Recalcular la meta para la referencia actualizada
                                            IF NEW.tiempoDeProduccion > 0 THEN
                                                UPDATE metas
                                                SET meta = FLOOR((522 * cantidad_empleados_activos) / NEW.tiempoDeProduccion)
                                                WHERE ref_id = NEW.ref_id;
                                            ELSE
                                                -- Manejar casos donde tiempoDeProduccion sea 0 (evitar división por cero)
                                                UPDATE metas
                                                SET meta = 0
                                                WHERE ref_id = NEW.ref_id;
                                            END IF;
                                    END

                    CREATE TRIGGER `recalcular_meta_al_eliminar_operario` AFTER DELETE ON `operarios`
                    FOR EACH ROW BEGIN
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
                            SET metas.meta = FLOOR((522 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
                            WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1;
                        END IF;
                    END

                    CREATE TRIGGER `recalcular_meta_al_insertar_operario` AFTER INSERT ON `operarios`
                    FOR EACH ROW BEGIN
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
                            SET metas.meta = FLOOR((522 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
                            WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1;
                        END IF;
                    END
                    ";
    }
}
