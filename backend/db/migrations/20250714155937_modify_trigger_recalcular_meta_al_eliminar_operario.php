<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class ModifyTriggerRecalcularMetaAlEliminarOperario extends AbstractMigration
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
        $this->execute('DROP TRIGGER IF EXISTS recalcular_meta_al_eliminar_operario');
        $sql = '
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
END';
$this->execute($sql);
    }
    public function down(): void
    {
        $this->execute('DROP TRIGGER IF EXISTS recalcular_meta_al_eliminar_operario');
        $sql = '
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
        SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
        WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1;
    END IF;
END';
$this->execute($sql);
    }
}
