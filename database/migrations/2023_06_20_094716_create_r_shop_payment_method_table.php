<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopPaymentMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_payment_method', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')->nullable(false);
            $table->unsignedBigInteger('m_payment_method_id')->nullable(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_payment_method');
    }
}
