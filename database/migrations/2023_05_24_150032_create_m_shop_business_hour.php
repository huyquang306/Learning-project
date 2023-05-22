<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShopBusinessHour extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop_business_hour', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16);
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->unsignedBigInteger('t_shop_announcement_id')
                ->nullable();
            $table->string('name');
            $table->string('start_time');
            $table->string('finish_time');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('t_shop_announcement_id')
                ->references('id')
                ->on('t_shop_announcement');
            $table->index(['m_shop_id']);
            $table->index(['t_shop_announcement_id']);
            $table->index(['m_shop_id', 't_shop_announcement_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_shop_business_hour');
    }
}
