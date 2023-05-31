<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMImageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_image', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('s_image_path')->nullable();
            $table->string('m_image_path')->nullable();
            $table->string('l_image_path')->nullable();
            $table->string('image_path');
            $table->tinyInteger('image_type')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_image');
    }
}
