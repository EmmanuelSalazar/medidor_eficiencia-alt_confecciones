<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class ModifyTriggerCalcularMetaEficiencia extends AbstractMigration
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
        $this->execute('DROP TRIGGER IF EXISTS recalcular_meta_al_actualizar_operarios');
        $sql = '
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
        ';
        $this->execute($sql);
    }
    public function down():void {
        $this->execute('DROP TRIGGER IF EXISTS recalcular_meta_al_actualizar_operarios');
        $sql = '
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
        ';
        $this->execute($sql);
    }
}
