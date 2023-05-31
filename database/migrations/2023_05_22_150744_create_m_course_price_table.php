<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMCoursePriceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_course_price', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16)
                ->nullable();
            $table->unsignedBigInteger('r_shop_course_id')
                ->nullable();
            $table->time('block_time_start');
            $table->time('block_time_finish');
            $table->integer('unit_price');
            $table->unsignedInteger('tax_value')
                ->default(0);
            $table->unsignedBigInteger('m_tax_id')
                ->nullable();
            $table->string('status', 10)
                ->default('active');
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('r_shop_course_id')
                ->references('id')
                ->on('r_shop_course');
            $table->foreign('m_tax_id')
                ->references('id')
                ->on('m_tax');
            $table->index(['r_shop_course_id']);
            $table->index(['m_tax_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_course_price');
    }
}
