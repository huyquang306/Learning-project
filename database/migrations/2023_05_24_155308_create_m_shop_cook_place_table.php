<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShopCookPlaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop_cook_place', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16)
                ->nullable();
            $table->unsignedBigInteger('m_shop_id')->nullable(false);
            $table->string('name', 32);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->index(['m_shop_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_shop_cook_place');
    }
}
