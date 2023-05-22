<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRCourseMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_course_menu', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_course_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_menu_id')
                ->nullable(false);
            $table->string('status', 10)
                ->default('active');
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_course_id')
                ->references('id')
                ->on('m_course');
            $table->foreign('m_menu_id')
                ->references('id')
                ->on('m_menu');
            $table->index(['m_course_id']);
            $table->index(['m_menu_id']);
            $table->index(['m_course_id', 'm_menu_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_course_menu');
    }
}
