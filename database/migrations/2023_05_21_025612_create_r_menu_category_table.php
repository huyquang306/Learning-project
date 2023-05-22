<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRMenuCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_menu_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('r_shop_menu_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_menu_category_id')
                ->nullable(false);
            $table->unsignedBigInteger('modified_by')
                ->nullable(true);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('r_shop_menu_id')
                ->references('id')
                ->on('r_shop_menu');
            $table->foreign('m_menu_category_id')
                ->references('id')
                ->on('m_menu_category');
            $table->index(['r_shop_menu_id']);
            $table->index(['m_menu_category_id']);
        });
        DB::statement("ALTER TABLE `r_menu_category` comment 'Table relationship between m_menu and m_menu_category'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_menu_category');
    }
}
