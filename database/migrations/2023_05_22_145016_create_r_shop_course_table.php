<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_course', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_course_id')
                ->nullable(false);
            $table->string('status', 10)
                ->default('active');
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('m_course_id')
                ->references('id')
                ->on('m_course');
            $table->index(['m_shop_id']);
            $table->index(['m_course_id']);
            $table->index(['m_shop_id', 'm_course_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_course');
    }
}
