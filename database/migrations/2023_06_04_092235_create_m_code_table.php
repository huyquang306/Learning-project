<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMCodeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_code', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false)
                ->default(0);
            $table->string('code', 255)
                ->nullable(false);
            $table->string('type', 255)
                ->nullable(false);
            $table->string('vi', 255)
                ->nullable(false);
            $table->string('en', 255);
            $table->string('misc');
            $table->integer('show_order')
                ->nullable(false)
                ->default(1);
            $table->softDeletes();
            $table->timestamps();
            $table->unsignedBigInteger('modified_by')
                ->nullable();

            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->index('m_shop_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_code');
    }
}
