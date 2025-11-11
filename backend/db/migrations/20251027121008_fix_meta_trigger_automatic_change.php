<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class FixMetaTriggerAutomaticChange extends AbstractMigration
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
        $this->execute("
            DROP TRIGGER IF EXISTS `recalcular_meta_al_actualizar_referencia`;
        ");
        $sql = 'CREATE TRIGGER `recalcular_meta_al_actualizar_referencia` AFTER UPDATE ON `referencias`
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
                        ';
        $this->execute($sql);
    }
    public function down(): void
    {
        $this->execute("
            DROP TRIGGER IF EXISTS `recalcular_meta_al_actualizar_referencia`;
        ");
        $sql = 'CREATE TRIGGER `recalcular_meta_al_actualizar_referencia` AFTER UPDATE ON `referencias`
 FOR EACH ROW BEGIN
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
            SET meta = FLOOR((522 * cantidad_empleados_activos) / NEW.tiempoDeProduccion)
            WHERE ref_id = NEW.ref_id;
        ELSE
            -- Manejar casos donde tiempoDeProduccion sea 0 (evitar división por cero)
            UPDATE metas
            SET meta = 0
            WHERE ref_id = NEW.ref_id;
        END IF;
    END IF;
END      
        ';
        $this->execute($sql);
    }
}
