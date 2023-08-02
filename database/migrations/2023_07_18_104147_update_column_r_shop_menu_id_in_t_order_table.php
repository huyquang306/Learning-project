<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColumnRShopMenuIdInTOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('t_order', function (Blueprint $table) {
            $table->dropForeign(['r_shop_menu_id']);
            $table->dropIndex(['r_shop_menu_id']);
        });
        Schema::table('t_order', function (Blueprint $table) {
            $table->bigInteger('r_shop_menu_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('t_order', function (Blueprint $table) {
            $table->unsignedBigInteger('r_shop_menu_id')->nullable(false);
            $table->foreign('r_shop_menu_id')
                ->references('id')
                ->on('r_shop_menu');
            $table->index(['r_shop_menu_id']);
        });
    }
}
