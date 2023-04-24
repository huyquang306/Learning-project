<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_item', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_shop_id')
                ->comment('Fk reference to shop');
            $table->unsignedBigInteger('m_item_id')
                ->comment('Fk reference to item');
            $table->unsignedInteger('daily_stocks')
                ->default(0)
                ->comment('Set inventory quantity by day');
            $table->unsignedInteger('real_stocks')
                ->default(0)
                ->comment('Actual inventory');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('m_item_id')
                ->references('id')
                ->on('m_item');
            $table->index(['m_shop_id', 'm_item_id']);
            $table->index(['m_shop_id']);
            $table->index(['m_item_id']);
        });
        DB::statement("ALTER TABLE `r_shop_item` comment 'Shop x Item relationship'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_item');
    }
}
