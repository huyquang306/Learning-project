<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShopPosSettingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop_pos_setting', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')->nullable(false);
            $table->unsignedBigInteger('m_currency_id')->nullable(false);
            $table->unsignedBigInteger('m_country_id')->nullable(false);
            $table->tinyInteger('price_fraction_mode')->default(0);
            $table->tinyInteger('total_amount_fraction_mode')->default(0);
            $table->tinyInteger('price_display_mode')->default(0);
            $table->decimal('serve_charge_rate', 10, 4)->default(0);
            $table->boolean('serve_charge_in_use')->default(false);
            $table->timestamps();

            $table->index(['m_shop_id', 'm_currency_id', 'm_country_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_shop_pos_setting');
    }
}
