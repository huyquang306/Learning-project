<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShopBusinessHourPrice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop_business_hour_price', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('r_shop_menu_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_shop_business_hour_id')
                ->nullable(false);
            $table->decimal('price', 10, 4)
                ->default(0);
            $table->decimal('tax_value', 10, 4)
                ->default(0);
            $table->tinyInteger('display_flg')
                ->default(1);
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
        Schema::dropIfExists('m_shop_business_hour_price');
    }
}
