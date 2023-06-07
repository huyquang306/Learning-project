<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShopMetaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop_meta', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->string('type');
            $table->json('value')->nullable();
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
        Schema::dropIfExists('m_shop_meta');
    }
}
