<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTTmpShop extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_tmp_shop', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 128)->unique();
            $table->tinyInteger('type')->default(0);
            $table->json('shop_info')->nullable();
            $table->dateTime('expired_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_tmp_shop');
    }
}
