<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class NewDescriptionToRolColumnOnOperarios extends AbstractMigration
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
    public function change(): void
    {
        $table = $this->table('operarios');
        $table->changeColumn('rol', 'smallinteger', ['default' => 1, 'after' => 'activo', 'null' => false, 'comment' => '1: Operari@s, 2: Revisador@s, 3: Empaquetador@s, 4: Revisador@sMetaNormal']);
        $table->update();
    }
}
