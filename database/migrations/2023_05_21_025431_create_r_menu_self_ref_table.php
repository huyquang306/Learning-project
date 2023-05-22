<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRMenuSelfRefTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_menu_self_ref', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_menu_id_parent')
                ->nullable(false);
            $table->unsignedBigInteger('m_menu_id_child')
                ->nullable(false);
            $table->unsignedBigInteger('modified_by')
                ->nullable(true);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_menu_id_parent')
                ->references('id')
                ->on('m_menu');
            $table->foreign('m_menu_id_child')
                ->references('id')
                ->on('m_menu');
            $table->index(['m_menu_id_parent']);
            $table->index(['m_menu_id_child']);
        });
        DB::statement("ALTER TABLE `r_menu_self_ref` comment 'Table relationship between child_menu and parent_menu'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_menu_self_ref');
    }
}
