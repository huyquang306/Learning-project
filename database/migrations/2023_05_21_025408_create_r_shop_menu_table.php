<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_menu', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_menu_id')
                ->nullable(false);
            $table->integer('daily_stocks')
                ->default(0);
            $table->unsignedInteger('real_stocks')
                ->default(0);
            $table->unsignedInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('m_menu_id')
                ->references('id')
                ->on('m_menu');
            $table->index(['m_shop_id']);
            $table->index(['m_menu_id']);
            $table->index(['m_shop_id', 'm_menu_id']);
        });
        DB::statement("ALTER TABLE `r_shop_menu` comment 'Table relationship between m_shop and m_menu'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_menu');
    }
}
