<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class AddTriggerToBodega extends AbstractMigration
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
        $this->execute("DROP TRIGGER IF EXISTS `BODEGA_verificar_estado`;");
        $sql = '
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
        ';
        $this->execute($sql);
    }

    public function down(): void
    {
        $sql = 'DROP TRIGGER IF EXISTS `BODEGA_verificar_estado`';
        $this->execute($sql);
    }
}
