<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTShopAnouncementTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_shop_announcement', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16);
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->string('content')->nullable();
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
        Schema::dropIfExists('t_shop_announcement');
    }
}
