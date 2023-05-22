<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRTableOrdergroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_table_ordergroup', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_table_id')
                ->nullable(false);
            $table->unsignedBigInteger('t_ordergroup_id')
                ->nullable(false);
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_table_id')
                ->references('id')
                ->on('m_table');
            $table->foreign('t_ordergroup_id')
                ->references('id')
                ->on('t_ordergroup');
            $table->index(['m_table_id']);
            $table->index(['t_ordergroup_id']);
        });
        DB::statement("ALTER TABLE `r_menu_category` comment 'Table relationship between m_table and t_ordergroup'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_table_ordergroup');
    }
}
