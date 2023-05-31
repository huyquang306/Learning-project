<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRMenuImageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_menu_image', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_menu_id');
            $table->unsignedBigInteger('m_image_id');
            $table->timestamps();

            $table->foreign('m_menu_id')
                ->references('id')
                ->on('m_menu');
            $table->foreign('m_image_id')
                ->references('id')
                ->on('m_image');
            $table->index(['m_menu_id', 'm_image_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_menu_image');
    }
}
