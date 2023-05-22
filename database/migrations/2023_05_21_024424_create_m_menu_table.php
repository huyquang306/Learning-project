<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_menu', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 128);
            $table->string('name', 100);
            $table->integer('price');
            $table->string('s_image_folder_path', 128)->nullable();
            $table->string('m_image_folder_path', 128)->nullable();
            $table->string('l_image_folder_path', 128)->nullable();
            $table->string('image_file_name', 128)->nullable();
            $table->float('review_rate')->nullable();
            $table->string('status', 10)
                ->default('onsale')
                ->comment('onsale|not-onsale');
            $table->boolean('is_course')
                ->default(false)
                ->comment('Whether it is a course menu');
            $table->boolean('is_course_only')
                ->default(false)
                ->comment('Whether it is only for course');
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->unique('hash_id');
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement("ALTER TABLE `m_menu` comment 'Menu master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_menu');
    }
}
