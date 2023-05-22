<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMMenuCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_menu_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->string('code', 5)
                ->nullable(false);
            $table->string('name', 100)
                ->nullable(false);
            $table->char('short_name', 10)
                ->nullable();
            $table->bigInteger('parent_id')
                ->nullable(false);
            $table->integer('tier_number')
                ->nullable(false);
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->index('m_shop_id');
        });
        DB::statement("ALTER TABLE `m_menu_category` comment 'Table m_menu_category master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_menu_category');
    }
}
